/**
 * PATCH /personal/denuncias/:id/atendida
 * Finalizar atención de denuncia y marcar como ATENDIDA
 * Incluye upload de evidencias y creación de reporte
 */

const router = require('express').Router();
const Denuncia = require('../../Models/denuncia');
const User = require('../../Models/user');
const PersonalMunicipal = require('../../Models/personalMunicipal');
const ReporteAtencion = require('../../Models/reporteAtencion');
const { createAndEmitNotification } = require('../../utils/notificationService');
const { sendResponse } = require('../../utils/responseHandler');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar multer para memoria (compatible con serverless)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB por archivo
}).array('evidencias', 10); // Máximo 10 archivos

// Función para subir a Cloudinary desde buffer
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'reportes_atencion' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

router.patch('/:id/atendida', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error en upload:', err);
      return sendResponse(res, 400, {}, 'Error al procesar archivos: ' + err.message);
    }

    try {
      const { id } = req.params;
      const { descripcion } = req.body;
      const personalId = req.userId;

      // Validar descripción
      if (!descripcion || descripcion.trim().length < 20) {
        return sendResponse(res, 400, {}, 'Debe proporcionar una descripción del trabajo realizado (mínimo 20 caracteres)');
      }

      // Buscar la denuncia
      const denuncia = await Denuncia.findById(id);

      if (!denuncia) {
        return sendResponse(res, 404, {}, 'Denuncia no encontrada');
      }

      if (denuncia.isDeleted) {
        return sendResponse(res, 400, {}, 'Esta denuncia ha sido eliminada');
      }

      // Verificar que la denuncia esté asignada al personal autenticado
      if (!denuncia.assigneeId || denuncia.assigneeId.toString() !== personalId) {
        return sendResponse(res, 403, {}, 'No tiene permisos para modificar esta denuncia');
      }

      // Verificar que esté en estado EN_PROCESO
      if (denuncia.estado !== 'EN_PROCESO') {
        return sendResponse(res, 400, {}, 'Solo se pueden finalizar denuncias en estado EN_PROCESO');
      }

      // Subir evidencias a Cloudinary (si hay archivos)
      let evidenciasUrls = [];
      if (req.files && req.files.length > 0) {
        console.log(`Subiendo ${req.files.length} archivos de evidencia...`);
        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
        evidenciasUrls = await Promise.all(uploadPromises);
        console.log(`✓ ${evidenciasUrls.length} evidencias subidas`);
      }

      // Crear reporte de atención
      const reporte = await ReporteAtencion.create({
        denunciaId: denuncia._id,
        staffId: personalId,
        descripcion: descripcion.trim(),
        evidencia: evidenciasUrls
      });

      // Cambiar estado a ATENDIDA
      denuncia.estado = 'ATENDIDA';
      
      // Obtener datos del personal
      const personal = await PersonalMunicipal.findById(personalId);

      // Agregar al historial
      denuncia.historialEstados.push({
        estado: 'ATENDIDA',
        fecha: new Date(),
        adminResponsable: personalId,
        observaciones: `Atención finalizada por ${personal.nombreCompleto}. Reporte ID: ${reporte._id}`
      });

      await denuncia.save();

      // Incrementar contador de denuncias resueltas del personal
      personal.denunciasResueltas = (personal.denunciasResueltas || 0) + 1;
      await personal.save();

      // Obtener datos del usuario creador
      const usuario = await User.findById(denuncia.idDenunciante);

      // Notificar al usuario
      if (usuario) {
        await createAndEmitNotification({
          userId: usuario._id,
          userModel: 'User',
          type: 'denuncia_atendida',
          title: 'Denuncia Atendida',
          message: `Su denuncia "${denuncia.tituloDenuncia}" ha sido atendida completamente`,
          data: {
            denunciaId: denuncia._id,
            titulo: denuncia.tituloDenuncia,
            reporteId: reporte._id,
            personalNombre: personal.nombreCompleto
          },
          userEmail: usuario.email,
          emailData: {
            titulo: denuncia.tituloDenuncia,
            personalNombre: personal.nombreCompleto,
            denunciaId: denuncia._id
          }
        });
      }

      console.log(`✓ Denuncia ${id} finalizada como ATENDIDA por personal ${personalId}`);

      return sendResponse(res, 200, { denuncia, reporte }, 'Denuncia marcada como atendida exitosamente');

    } catch (error) {
      console.error('Error al finalizar atención:', error);
      return sendResponse(res, 500, {}, 'Error al finalizar la atención');
    }
  });
});

module.exports = router;
