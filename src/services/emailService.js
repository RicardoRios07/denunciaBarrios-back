/**
 * Servicio de Email usando Nodemailer con SMTP
 */

const nodemailer = require('nodemailer');

// Configurar transporter con SMTP de la municipalidad
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  // Timeout más alto para servidores lentos
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000
});

/**
 * Enviar email
 * @param {object} options - Opciones del email
 * @param {string} options.to - Destinatario
 * @param {string} options.subject - Asunto
 * @param {string} options.html - Contenido HTML
 * @param {string} options.text - Contenido texto plano (opcional)
 */
async function sendEmail({ to, subject, html, text }) {
  try {
    const mailOptions = {
      from: `"Denuncias Ciudadanas Loja" <${process.env.MUNICIPALIDAD_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || stripHtml(html) // Si no hay texto plano, generar desde HTML
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Email enviado a ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`✗ Error enviando email a ${to}:`, error.message);
    
    // Reintentar una vez si falla
    try {
      console.log('Reintentando envío de email...');
      const info = await transporter.sendMail({
        from: `"Denuncias Ciudadanas Loja" <${process.env.MUNICIPALIDAD_EMAIL || process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text: text || stripHtml(html)
      });
      console.log(`✓ Email enviado (reintento) a ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (retryError) {
      console.error(`✗ Error en reintento de email a ${to}:`, retryError.message);
      return { success: false, error: retryError.message };
    }
  }
}

/**
 * Verificar conexión SMTP
 */
async function verifyConnection() {
  try {
    await transporter.verify();
    console.log('✓ Servidor SMTP listo para enviar emails');
    return true;
  } catch (error) {
    console.error('✗ Error verificando conexión SMTP:', error.message);
    return false;
  }
}

/**
 * Eliminar tags HTML de un string
 */
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

module.exports = {
  sendEmail,
  verifyConnection
};
