const router = require('express').Router();
const Denuncia = require('../../Models/denuncia');
const verifyAdminToken = require('../../Middleware/verifyAdminToken');
const { sendResponse } = require('../../utils/responseHandler');

// Respuestas predeterminadas por categoría
const respuestasPredeterminadas = {
    'Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial': {
        tiempo_resolucion: {
            rapida: {
                mensaje: 'Su denuncia ha sido recibida y está siendo evaluada. El problema reportado será atendido dentro de las próximas 24-48 horas.',
                tiempoEstimado: '24-48 horas'
            },
            media: {
                mensaje: 'Su denuncia ha sido recibida. Debido a la complejidad del problema, el tiempo estimado de resolución es de 5-7 días hábiles.',
                tiempoEstimado: '5-7 días hábiles'
            },
            larga: {
                mensaje: 'Su denuncia requiere trabajos de infraestructura mayor. El tiempo estimado de resolución es de 15-30 días hábiles.',
                tiempoEstimado: '15-30 días hábiles'
            }
        },
        no_procede: {
            fuera_jurisdiccion: {
                mensaje: 'Lamentamos informarle que el problema reportado está fuera de la jurisdicción municipal. Le recomendamos contactar con la entidad correspondiente.',
                tiempoEstimado: 'No aplica'
            },
            falta_recursos: {
                mensaje: 'Actualmente no contamos con los recursos necesarios para atender esta denuncia. Será incluida en el plan de trabajo del próximo periodo fiscal.',
                tiempoEstimado: 'Próximo periodo fiscal'
            },
            no_evidencia: {
                mensaje: 'No se pudo verificar la situación reportada. Por favor, proporcione más evidencia o detalles para poder proceder.',
                tiempoEstimado: 'No aplica'
            }
        }
    },
    'Recolección de Desechos y Saneamiento Ambiental': {
        tiempo_resolucion: {
            rapida: {
                mensaje: 'Su reporte ha sido recibido. El equipo de saneamiento será despachado en las próximas 12-24 horas.',
                tiempoEstimado: '12-24 horas'
            },
            media: {
                mensaje: 'Su denuncia está en proceso. El tiempo estimado para la atención es de 3-5 días hábiles.',
                tiempoEstimado: '3-5 días hábiles'
            },
            larga: {
                mensaje: 'Su denuncia requiere coordinación con múltiples departamentos. Tiempo estimado: 7-10 días hábiles.',
                tiempoEstimado: '7-10 días hábiles'
            }
        },
        no_procede: {
            responsabilidad_privada: {
                mensaje: 'El problema reportado corresponde a propiedad privada. Le recomendamos contactar directamente con el propietario.',
                tiempoEstimado: 'No aplica'
            },
            falta_acceso: {
                mensaje: 'No es posible acceder al área reportada por restricciones de acceso. Se requiere autorización del propietario.',
                tiempoEstimado: 'Pendiente de autorización'
            }
        }
    },
    'Movilidad Urbana: Bacheo de Calles, Frecuencias, Obstrucciones de aceras, etc.': {
        tiempo_resolucion: {
            rapida: {
                mensaje: 'Equipo de obras públicas ha sido notificado. Intervención estimada en 2-3 días hábiles.',
                tiempoEstimado: '2-3 días hábiles'
            },
            media: {
                mensaje: 'Su denuncia está programada para atención. Tiempo estimado de reparación: 1-2 semanas.',
                tiempoEstimado: '1-2 semanas'
            },
            larga: {
                mensaje: 'El problema requiere planificación de obra mayor. Tiempo estimado: 3-4 semanas.',
                tiempoEstimado: '3-4 semanas'
            }
        },
        no_procede: {
            via_nacional: {
                mensaje: 'La vía reportada es de competencia nacional. Le recomendamos contactar al MTOP (Ministerio de Transporte y Obras Públicas).',
                tiempoEstimado: 'No aplica'
            },
            falta_presupuesto: {
                mensaje: 'La reparación requerida excede el presupuesto actual. Será incluida en el plan de bacheo del próximo trimestre.',
                tiempoEstimado: 'Próximo trimestre'
            }
        }
    },
    'Obstrucción de vías por construcciones, ornato, permisos de construcción': {
        tiempo_resolucion: {
            rapida: {
                mensaje: 'Inspector municipal será despachado para verificación en 24-48 horas. Se tomarán acciones inmediatas si procede.',
                tiempoEstimado: '24-48 horas'
            },
            media: {
                mensaje: 'Proceso de notificación al responsable iniciado. Tiempo estimado de resolución: 5-10 días hábiles.',
                tiempoEstimado: '5-10 días hábiles'
            },
            larga: {
                mensaje: 'La situación requiere proceso administrativo formal. Tiempo estimado: 15-20 días hábiles.',
                tiempoEstimado: '15-20 días hábiles'
            }
        },
        no_procede: {
            permiso_vigente: {
                mensaje: 'La construcción reportada cuenta con permisos municipales vigentes y cumple con las normativas.',
                tiempoEstimado: 'No aplica'
            },
            proceso_legal: {
                mensaje: 'El caso está en proceso legal. No podemos intervenir hasta resolución judicial.',
                tiempoEstimado: 'Pendiente resolución judicial'
            }
        }
    }
};

/**
 * @swagger
 * /admin/respuestaPredeterminada:
 *   post:
 *     summary: Asignar respuesta predeterminada a una denuncia
 *     tags:
 *       - Administrador
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               denunciaId:
 *                 type: string
 *                 description: ID de la denuncia
 *               tipoRespuesta:
 *                 type: string
 *                 enum: [tiempo_resolucion, no_procede, personalizada]
 *                 description: Tipo de respuesta
 *               subtipo:
 *                 type: string
 *                 description: Subtipo de respuesta (rapida, media, larga, etc.)
 *               mensajePersonalizado:
 *                 type: string
 *                 description: Mensaje personalizado (solo si tipoRespuesta es 'personalizada')
 *               tiempoEstimadoPersonalizado:
 *                 type: string
 *                 description: Tiempo estimado personalizado
 *             required:
 *               - denunciaId
 *               - tipoRespuesta
 *     responses:
 *       200:
 *         description: Respuesta asignada exitosamente
 *       400:
 *         description: Error en parámetros
 *       404:
 *         description: Denuncia no encontrada
 *       500:
 *         description: Error del servidor
 */

router.post('/', verifyAdminToken, async (req, res) => {
    try {
        const { denunciaId, tipoRespuesta, subtipo, mensajePersonalizado, tiempoEstimadoPersonalizado } = req.body;

        if (!denunciaId || !tipoRespuesta) {
            return sendResponse(res, 400, {}, 'Faltan parámetros requeridos: denunciaId y tipoRespuesta');
        }

        const denuncia = await Denuncia.findById(denunciaId);
        if (!denuncia) {
            return sendResponse(res, 404, {}, 'Denuncia no encontrada');
        }

        let respuesta = {
            tipo: tipoRespuesta,
            fechaRespuesta: new Date()
        };

        if (tipoRespuesta === 'personalizada') {
            if (!mensajePersonalizado) {
                return sendResponse(res, 400, {}, 'Se requiere mensajePersonalizado para respuestas personalizadas');
            }
            respuesta.mensaje = mensajePersonalizado;
            respuesta.tiempoEstimado = tiempoEstimadoPersonalizado || 'Por definir';
        } else {
            // Obtener respuesta predeterminada según categoría
            const respuestasPorCategoria = respuestasPredeterminadas[denuncia.categoria];
            
            if (!respuestasPorCategoria || !respuestasPorCategoria[tipoRespuesta]) {
                return sendResponse(res, 400, {}, 'Tipo de respuesta no válido para esta categoría');
            }

            if (!subtipo || !respuestasPorCategoria[tipoRespuesta][subtipo]) {
                return sendResponse(res, 400, {}, 'Subtipo de respuesta no válido');
            }

            const respuestaPredefinida = respuestasPorCategoria[tipoRespuesta][subtipo];
            respuesta.mensaje = respuestaPredefinida.mensaje;
            respuesta.tiempoEstimado = respuestaPredefinida.tiempoEstimado;
        }

        // Asignar respuesta a la denuncia
        denuncia.respuestaPredeterminada = respuesta;

        // Agregar al historial
        denuncia.historialEstados.push({
            estado: denuncia.estado,
            fecha: new Date(),
            adminResponsable: req.adminId,
            observaciones: `Respuesta asignada: ${respuesta.mensaje.substring(0, 100)}...`
        });

        await denuncia.save();

        return sendResponse(res, 200, denuncia, 'Respuesta asignada exitosamente');
    } catch (error) {
        console.error('Error al asignar respuesta:', error);
        return sendResponse(res, 500, {}, 'Error del servidor al asignar respuesta');
    }
});

/**
 * @swagger
 * /admin/respuestaPredeterminada/plantillas:
 *   get:
 *     summary: Obtener plantillas de respuestas predeterminadas
 *     tags:
 *       - Administrador
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Categoría para filtrar plantillas
 *     responses:
 *       200:
 *         description: Plantillas obtenidas exitosamente
 *       401:
 *         description: No autorizado
 */

router.get('/plantillas', verifyAdminToken, async (req, res) => {
    try {
        const { categoria } = req.query;

        if (categoria) {
            const plantillas = respuestasPredeterminadas[categoria];
            if (!plantillas) {
                return sendResponse(res, 404, {}, 'No hay plantillas para esta categoría');
            }
            return sendResponse(res, 200, { categoria, plantillas }, 'Plantillas obtenidas exitosamente');
        }

        return sendResponse(res, 200, respuestasPredeterminadas, 'Todas las plantillas obtenidas exitosamente');
    } catch (error) {
        console.error('Error al obtener plantillas:', error);
        return sendResponse(res, 500, {}, 'Error del servidor al obtener plantillas');
    }
});

module.exports = router;
