/**
 * GET /personal/estadisticas
 * Obtener estadísticas del personal autenticado
 */

const router = require('express').Router();
const Denuncia = require('../../Models/denuncia');
const PersonalMunicipal = require('../../Models/personalMunicipal');
const { sendResponse } = require('../../utils/responseHandler');

router.get('/', async (req, res) => {
  try {
    const personalId = req.userId;

    // Obtener datos del personal
    const personal = await PersonalMunicipal.findById(personalId);
    
    if (!personal) {
      return sendResponse(res, 404, {}, 'Personal no encontrado');
    }

    // Contar denuncias asignadas (actuales, no atendidas)
    const denunciasAsignadas = await Denuncia.countDocuments({
      assigneeId: personalId,
      estado: { $in: ['VERIFICADA_NO_ATENDIDA', 'EN_PROCESO'] },
      isDeleted: false
    });

    // Contar denuncias en proceso
    const enProceso = await Denuncia.countDocuments({
      assigneeId: personalId,
      estado: 'EN_PROCESO',
      isDeleted: false
    });

    // Total resueltas (del campo del personal)
    const denunciasResueltas = personal.denunciasResueltas || 0;

    // Calcular tiempo promedio de resolución
    const denunciasAtendidas = await Denuncia.find({
      assigneeId: personalId,
      estado: 'ATENDIDA',
      isDeleted: false
    }).select('historialEstados');

    let tiempoPromedioResolucion = 0;
    if (denunciasAtendidas.length > 0) {
      let totalTiempo = 0;
      let count = 0;

      denunciasAtendidas.forEach(denuncia => {
        // Buscar la fecha de asignación y la fecha de atención
        const asignacion = denuncia.historialEstados.find(h => 
          h.estado === 'VERIFICADA_NO_ATENDIDA' || h.estado === 'EN_PROCESO'
        );
        const atencion = denuncia.historialEstados.find(h => h.estado === 'ATENDIDA');

        if (asignacion && atencion) {
          const tiempoDias = (new Date(atencion.fecha) - new Date(asignacion.fecha)) / (1000 * 60 * 60 * 24);
          totalTiempo += tiempoDias;
          count++;
        }
      });

      if (count > 0) {
        tiempoPromedioResolucion = Math.round(totalTiempo / count * 10) / 10; // Redondear a 1 decimal
      }
    }

    const estadisticas = {
      nombreCompleto: personal.nombreCompleto,
      departamento: personal.departamento,
      especialidad: personal.especialidad,
      denunciasAsignadas,  // Actuales sin atender
      enProceso,
      denunciasResueltas,  // Total histórico
      tiempoPromedioResolucion, // En días
      calificacionPromedio: personal.calificacionPromedio || 0
    };

    console.log(`✓ Estadísticas obtenidas para personal ${personalId}`);

    return sendResponse(res, 200, estadisticas, 'Estadísticas obtenidas');

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return sendResponse(res, 500, {}, 'Error al obtener estadísticas');
  }
});

module.exports = router;
