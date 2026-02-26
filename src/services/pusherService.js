/**
 * Servicio de Pusher para WebSockets en tiempo real
 * Compatible con Vercel (serverless)
 */

const Pusher = require('pusher');

// Inicializar Pusher con variables de entorno
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER || 'us2',
    useTLS: true
});

/**
 * Enviar notificación a un usuario específico
 * @param {string} userId - ID del usuario
 * @param {string} eventName - Nombre del evento
 * @param {object} data - Datos a enviar
 */
async function triggerNotification(userId, eventName, data) {
    try {
        await pusher.trigger(`private-user-${userId}`, eventName, data);
        return true;
    } catch (error) {
        console.error('Error enviando notificación via Pusher:', error);
        return false;
    }
}

/**
 * Enviar notificación a todos los administradores
 * @param {string} eventName - Nombre del evento
 * @param {object} data - Datos a enviar
 */
async function triggerToAdmins(eventName, data) {
    try {
        await pusher.trigger('private-admins-channel', eventName, data);
        return true;
    } catch (error) {
        console.error('Error enviando notificación a admins via Pusher:', error);
        return false;
    }
}

/**
 * Autenticar canal privado de Pusher
 * @param {string} socketId - Socket ID del cliente
 * @param {string} channelName - Nombre del canal
 * @param {object} presenceData - Datos de presencia (opcional)
 */
function authenticateChannel(socketId, channelName, presenceData) {
    try {
        if (presenceData) {
            return pusher.authorizeChannel(socketId, channelName, presenceData);
        }
        return pusher.authorizeChannel(socketId, channelName);
    } catch (error) {
        console.error('Error autenticando canal de Pusher:', error);
        throw error;
    }
}

module.exports = {
    pusher,
    triggerNotification,
    triggerToAdmins,
    authenticateChannel
};
