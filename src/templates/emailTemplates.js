/**
 * Plantillas de email en español para notificaciones
 */

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Estilos CSS inline para compatibilidad con clientes de email
const styles = {
  container: 'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;',
  card: 'background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);',
  header: 'background-color: #213C7D; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;',
  title: 'margin: 0; font-size: 24px; font-weight: bold;',
  content: 'padding: 20px 0; color: #333; line-height: 1.6;',
  button: 'display: inline-block; background-color: #35C2FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;',
  footer: 'text-align: center; color: #666; font-size: 12px; padding: 20px 0; border-top: 1px solid #ddd; margin-top: 30px;',
  alert: 'padding: 15px; border-radius: 5px; margin: 15px 0;',
  alertSuccess: 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;',
  alertDanger: 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;',
  alertWarning: 'background-color: #fff3cd; color: #856404; border: 1px solid #ffeaa7;'
};

/**
 * Template base para todos los emails
 */
function baseTemplate(title, content) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="${styles.container}">
        <div style="${styles.card}">
          <div style="${styles.header}">
            <h1 style="${styles.title}">🏛️ Municipalidad de Loja</h1>
            <p style="margin: 5px 0 0 0;">Sistema de Denuncias Ciudadanas</p>
          </div>
          <div style="${styles.content}">
            ${content}
          </div>
          <div style="${styles.footer}">
            <p><strong>Municipalidad de Loja</strong></p>
            <p>Gestión de Denuncias Ciudadanas</p>
            <p>Este es un correo automático, por favor no responder.</p>
            <p>Para consultas, ingrese a la plataforma: <a href="${FRONTEND_URL}">${FRONTEND_URL}</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Obtener template de email según tipo de notificación
 */
function getEmailTemplate(type, data) {
  const templates = {
    denuncia_creada: {
      subject: '✓ Denuncia Creada Exitosamente',
      html: baseTemplate('Denuncia Creada', `
        <h2 style="color: #213C7D;">Denuncia Registrada</h2>
        <p>Estimado/a ciudadano/a,</p>
        <p>Su denuncia ha sido registrada exitosamente en nuestro sistema.</p>
        <div style="${styles.alert} ${styles.alertSuccess}">
          <strong>Título:</strong> ${data.titulo}<br>
          <strong>Categoría:</strong> ${data.categoria || 'No especificada'}<br>
          <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
        </div>
        <p>Su denuncia será revisada por nuestro equipo administrativo. Le notificaremos cualquier actualización sobre el estado de su denuncia.</p>
        <a href="${FRONTEND_URL}/dashboard/denuncias/${data.denunciaId}" style="${styles.button}">Ver Mi Denuncia</a>
        <p style="color: #666; font-size: 14px;">Número de seguimiento: <strong>${data.denunciaId}</strong></p>
      `)
    },

    denuncia_validada: {
      subject: '✓ Su Denuncia Ha Sido Validada',
      html: baseTemplate('Denuncia Validada', `
        <h2 style="color: #00A63D;">¡Buenas Noticias!</h2>
        <p>Estimado/a ciudadano/a,</p>
        <p>Su denuncia ha sido <strong>validada</strong> por nuestro equipo administrativo.</p>
        <div style="${styles.alert} ${styles.alertSuccess}">
          <p><strong>Estado:</strong> Verificada - En espera de asignación</p>
          <p>Su denuncia cumple con los requisitos y será atendida por nuestro personal municipal.</p>
        </div>
        <p>En breve asignaremos personal especializado para atender su caso. Le mantendremos informado de cada paso del proceso.</p>
        <a href="${FRONTEND_URL}/dashboard/denuncias/${data.denunciaId}" style="${styles.button}">Ver Estado de Mi Denuncia</a>
      `)
    },

    denuncia_invalida: {
      subject: '⚠️ Información Sobre Su Denuncia',
      html: baseTemplate('Denuncia No Válida', `
        <h2 style="color: #E30712;">Información Importante</h2>
        <p>Estimado/a ciudadano/a,</p>
        <p>Lamentamos informarle que su denuncia ha sido marcada como <strong>no válida</strong> por las siguientes razones:</p>
        <div style="${styles.alert} ${styles.alertDanger}">
          <strong>Motivo:</strong><br>
          ${data.motivo || 'No se proporcionó un motivo específico'}
        </div>
        <p>Si considera que esta decisión es incorrecta o tiene evidencia adicional, puede crear una nueva denuncia con información más detallada.</p>
        <a href="${FRONTEND_URL}/dashboard/denuncias/${data.denunciaId}" style="${styles.button}">Ver Detalles</a>
        <p style="color: #666; font-size: 14px;"><em>Para cualquier consulta, puede comunicarse con nuestras oficinas.</em></p>
      `)
    },

    denuncia_no_atendible: {
      subject: 'ℹ️ Actualización Sobre Su Denuncia',
      html: baseTemplate('Denuncia No Atendible', `
        <h2 style="color: #856404;">Información Sobre Su Denuncia</h2>
        <p>Estimado/a ciudadano/a,</p>
        <p>Hemos revisado su denuncia y le informamos lo siguiente:</p>
        <div style="${styles.alert} ${styles.alertWarning}">
          <strong>Estado:</strong> No Atendible<br><br>
          <strong>Explicación:</strong><br>
          ${data.razon || 'Esta denuncia no puede ser atendida en este momento.'}
        </div>
        <p>Agradecemos su comprensión. Si tiene alguna pregunta adicional, no dude en contactarnos.</p>
        <a href="${FRONTEND_URL}/dashboard/denuncias/${data.denunciaId}" style="${styles.button}">Ver Detalles Completos</a>
      `)
    },

    denuncia_asignada: {
      subject: '👷 Personal Asignado a Su Denuncia',
      html: baseTemplate('Personal Asignado', `
        <h2 style="color: #35C2FF;">Personal Asignado</h2>
        <p>Estimado/a ciudadano/a,</p>
        <p>¡Excelentes noticias! Hemos asignado personal especializado para atender su denuncia.</p>
        <div style="${styles.alert} ${styles.alertSuccess}">
          <strong>Personal Asignado:</strong> ${data.personalNombre || 'Personal Municipal'}<br>
          <strong>Departamento:</strong> ${data.departamento || 'Departamento correspondiente'}<br>
          <strong>Estado:</strong> Verificada y Asignada
        </div>
        <p>El personal asignado revisará su caso y procederá con la atención correspondiente. Le notificaremos cuando inicien el proceso.</p>
        <a href="${FRONTEND_URL}/dashboard/denuncias/${data.denunciaId}" style="${styles.button}">Seguir Mi Denuncia</a>
      `)
    },

    denuncia_en_proceso: {
      subject: '🔧 Atención de Su Denuncia en Proceso',
      html: baseTemplate('En Proceso de Atención', `
        <h2 style="color: #213C7D;">Atención en Proceso</h2>
        <p>Estimado/a ciudadano/a,</p>
        <p>Le informamos que nuestro personal ha <strong>iniciado la atención</strong> de su denuncia.</p>
        <div style="${styles.alert} ${styles.alertSuccess}">
          <strong>Personal a cargo:</strong> ${data.personalNombre || 'Personal Municipal'}<br>
          <strong>Estado:</strong> En Proceso de Atención<br>
          <strong>Fecha de inicio:</strong> ${new Date().toLocaleDateString('es-ES')}
        </div>
        <p>El personal está trabajando activamente en la resolución. Le notificaremos cuando se complete la atención.</p>
        <a href="${FRONTEND_URL}/dashboard/denuncias/${data.denunciaId}" style="${styles.button}">Ver Progreso</a>
      `)
    },

    denuncia_atendida: {
      subject: '✅ Su Denuncia Ha Sido Atendida',
      html: baseTemplate('Denuncia Atendida', `
        <h2 style="color: #00A63D;">¡Denuncia Atendida Exitosamente!</h2>
        <p>Estimado/a ciudadano/a,</p>
        <p>Nos complace informarle que su denuncia ha sido <strong>atendida y resuelta</strong>.</p>
        <div style="${styles.alert} ${styles.alertSuccess}">
          <strong>Estado:</strong> Atendida ✓<br>
          <strong>Fecha de finalización:</strong> ${new Date().toLocaleDateString('es-ES')}<br>
          <strong>Personal que atendió:</strong> ${data.personalNombre || 'Personal Municipal'}
        </div>
        <p>Puede revisar el reporte completo de atención, incluyendo las acciones realizadas y evidencia fotográfica, en la plataforma.</p>
        <a href="${FRONTEND_URL}/dashboard/denuncias/${data.denunciaId}" style="${styles.button}">Ver Reporte de Atención</a>
        <p style="color: #666; font-size: 14px; margin-top: 20px;"><em>Gracias por su participación ciudadana. Su colaboración nos ayuda a mejorar nuestra ciudad.</em></p>
      `)
    }
  };

  return templates[type] || {
    subject: 'Notificación del Sistema',
    html: baseTemplate('Notificación', `<p>Ha recibido una nueva notificación.</p>`)
  };
}

module.exports = {
  getEmailTemplate
};
