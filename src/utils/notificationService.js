/**
 * Servicio de Notificaciones
 * Integra persistencia en DB, WebSocket (Pusher) y Email
 */

const Notificacion = require('../Models/notificacion');
const { triggerNotification, triggerToAdmins } = require('../services/pusherService');
const { sendEmail } = require('../services/emailService');
const { getEmailTemplate } = require('../templates/emailTemplates');

/**
 * Crear y emitir notificación a un usuario específico
 * @param {object} params - Parámetros de la notificación
 * @param {string} params.userId - ID del usuario destinatario
 * @param {string} params.userModel - Modelo del usuario ('User', 'Admin', 'PersonalMunicipal')
 * @param {string} params.type - Tipo de notificación
 * @param {string} params.title - Título de la notificación
 * @param {string} params.message - Mensaje de la notificación
 * @param {object} params.data - Datos adicionales
 * @param {string} params.userEmail - Email del usuario (opcional, para enviar email)
 * @param {object} params.emailData - Datos adicionales para el template de email
 */
async function createAndEmitNotification({
  userId,
  userModel = 'User',
  type,
  title,
  message,
  data = {},
  userEmail = null,
  emailData = {}
}) {
  try {
    // 1. Crear notificación en base de datos
    const notificacion = await Notificacion.create({
      userId,
      userModel,
      type,
      title,
      message,
      data
    });

    console.log(`✓ Notificación creada en DB para usuario ${userId}: ${type}`);

    // 2. Emitir via Pusher (WebSocket en tiempo real)
    const pusherData = {
      _id: notificacion._id.toString(),
      type,
      title,
      message,
      data,
      createdAt: notificacion.createdAt
    };

    const pusherSent = await triggerNotification(userId, 'notification', pusherData);
    if (pusherSent) {
      console.log(`✓ Notificación enviada via Pusher a usuario ${userId}`);
    } else {
      console.warn(`⚠ No se pudo enviar notificación via Pusher a usuario ${userId}`);
    }

    // 3. Enviar email si se proporciona el email del usuario
    if (userEmail && process.env.SMTP_HOST) {
      const emailTemplate = getEmailTemplate(type, { ...data, ...emailData });
      
      // Enviar email de forma asíncrona (no bloqueante)
      sendEmail({
        to: userEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      }).catch(error => {
        console.error(`Error enviando email a ${userEmail}:`, error.message);
      });
    }

    return notificacion;
  } catch (error) {
    console.error('Error creando notificación:', error);
    throw error;
  }
}

/**
 * Notificar a todos los administradores
 * @param {object} params - Parámetros de la notificación
 * @param {string} params.type - Tipo de notificación
 * @param {string} params.title - Título
 * @param {string} params.message - Mensaje
 * @param {object} params.data - Datos adicionales
 */
async function notifyAdmins({ type, title, message, data = {} }) {
  try {
    const Admin = require('../Models/admin');
    
    // Obtener todos los admins activos
    const admins = await Admin.find({ isDeleted: false, isVerified: true });

    if (admins.length === 0) {
      console.warn('⚠ No hay administradores para notificar');
      return [];
    }

    // Crear notificaciones para cada admin
    const notificaciones = await Promise.all(
      admins.map(admin =>
        Notificacion.create({
          userId: admin._id,
          userModel: 'Admin',
          type,
          title,
          message,
          data
        })
      )
    );

    console.log(`✓ ${notificaciones.length} notificaciones creadas para admins`);

    // Emitir via Pusher al canal de admins
    const pusherData = {
      type,
      title,
      message,
      data,
      createdAt: new Date()
    };

    const pusherSent = await triggerToAdmins('notification', pusherData);
    if (pusherSent) {
      console.log('✓ Notificación enviada via Pusher a canal de admins');
    }

    // Enviar emails a todos los admins (opcional, puede ser spam)
    // Descomentarsi se desea:
    // if (process.env.SMTP_HOST) {
    //   const emailTemplate = getEmailTemplate(type, data);
    //   admins.forEach(admin => {
    //     if (admin.email) {
    //       sendEmail({
    //         to: admin.email,
    //         subject: emailTemplate.subject,
    //         html: emailTemplate.html
    //       }).catch(error => console.error(`Error enviando email a admin ${admin.email}:`, error.message));
    //     }
    //   });
    // }

    return notificaciones;
  } catch (error) {
    console.error('Error notificando a admins:', error);
    throw error;
  }
}

/**
 * Marcar notificación como leída
 * @param {string} notificacionId - ID de la notificación
 * @param {string} userId - ID del usuario (para validar pertenencia)
 */
async function markAsRead(notificacionId, userId) {
  try {
    const notificacion = await Notificacion.findOneAndUpdate(
      { _id: notificacionId, userId },
      { readAt: new Date() },
      { new: true }
    );

    if (!notificacion) {
      throw new Error('Notificación no encontrada o no pertenece al usuario');
    }

    return notificacion;
  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    throw error;
  }
}

/**
 * Marcar varias notificaciones como leídas
 * @param {string[]} notificacionIds - Array de IDs de notificaciones
 * @param {string} userId - ID del usuario
 */
async function markMultipleAsRead(notificacionIds, userId) {
  try {
    const result = await Notificacion.updateMany(
      { _id: { $in: notificacionIds }, userId },
      { readAt: new Date() }
    );

    return result;
  } catch (error) {
    console.error('Error marcando múltiples notificaciones como leídas:', error);
    throw error;
  }
}

/**
 * Marcar todas las notificaciones del usuario como leídas
 * @param {string} userId - ID del usuario
 */
async function markAllAsRead(userId) {
  try {
    const result = await Notificacion.updateMany(
      { userId, readAt: null },
      { readAt: new Date() }
    );

    return result;
  } catch (error) {
    console.error('Error marcando todas las notificaciones como leídas:', error);
    throw error;
  }
}

/**
 * Obtener notificaciones de un usuario
 * @param {string} userId - ID del usuario
 * @param {object} options - Opciones de filtrado y paginación
 */
async function getNotifications(userId, options = {}) {
  try {
    const {
      page = 1,
      limit = 20,
      unreadOnly = false
    } = options;

    const query = { userId };
    if (unreadOnly) {
      query.readAt = null;
    }

    const notificaciones = await Notificacion.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notificacion.countDocuments(query);

    return {
      notificaciones,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    throw error;
  }
}

/**
 * Obtener contador de notificaciones no leídas
 * @param {string} userId - ID del usuario
 */
async function getUnreadCount(userId) {
  try {
    const count = await Notificacion.countDocuments({
      userId,
      readAt: null
    });

    return count;
  } catch (error) {
    console.error('Error obteniendo contador de no leídas:', error);
    throw error;
  }
}

module.exports = {
  createAndEmitNotification,
  notifyAdmins,
  markAsRead,
  markMultipleAsRead,
  markAllAsRead,
  getNotifications,
  getUnreadCount
};
