/**
 * Script de migración para actualizar denuncias existentes con nuevos campos
 * 
 * Ejecutar con: node scripts/migrateDenunciasNuevosCampos.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Denuncia = require('../src/Models/denuncia');

// Conectar a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/denunciasDB');
        console.log('✅ Conectado a MongoDB');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

// Función de migración
const migrarDenuncias = async () => {
    try {
        console.log('🚀 Iniciando migración de denuncias...\n');

        // Obtener todas las denuncias
        const denuncias = await Denuncia.find({});
        console.log(`📋 Total de denuncias a revisar: ${denuncias.length}\n`);

        let actualizadas = 0;
        let yaActualizadas = 0;
        let errores = 0;

        for (const denuncia of denuncias) {
            try {
                let necesitaActualizacion = false;
                const actualizacion = {};

                // Verificar y agregar campo prioridad si no existe
                if (!denuncia.prioridad) {
                    actualizacion.prioridad = 'Media';
                    necesitaActualizacion = true;
                }

                // Verificar y agregar historial inicial si no existe
                if (!denuncia.historialEstados || denuncia.historialEstados.length === 0) {
                    actualizacion.historialEstados = [{
                        estado: denuncia.estado || 'En revisión',
                        fecha: denuncia.createdAt || new Date(),
                        observaciones: 'Estado inicial - migrado automáticamente'
                    }];
                    necesitaActualizacion = true;
                }

                // Actualizar solo si es necesario
                if (necesitaActualizacion) {
                    await Denuncia.findByIdAndUpdate(
                        denuncia._id,
                        { $set: actualizacion },
                        { new: true, runValidators: true }
                    );

                    console.log(`✅ Actualizada: ${denuncia.tituloDenuncia}`);
                    console.log(`   - ID: ${denuncia._id}`);
                    console.log(`   - Estado: ${denuncia.estado}`);
                    console.log(`   - Prioridad: ${actualizacion.prioridad || 'Ya existía'}`);
                    console.log(`   - Historial: ${actualizacion.historialEstados ? 'Creado' : 'Ya existía'}\n`);
                    
                    actualizadas++;
                } else {
                    yaActualizadas++;
                }

            } catch (error) {
                console.error(`❌ Error actualizando denuncia ${denuncia._id}:`, error.message);
                errores++;
            }
        }

        console.log('\n📊 Resumen de Migración:');
        console.log(`   ✅ Actualizadas: ${actualizadas}`);
        console.log(`   ℹ️  Ya actualizadas: ${yaActualizadas}`);
        console.log(`   ❌ Errores: ${errores}`);
        console.log(`   📋 Total procesadas: ${denuncias.length}`);

        // Mostrar estadísticas de estados
        console.log('\n📈 Estadísticas de Estados:');
        const estadisticas = await Denuncia.aggregate([
            { $match: { isDeleted: false } },
            { 
                $group: { 
                    _id: '$estado', 
                    count: { $sum: 1 },
                    prioridad_alta: {
                        $sum: { $cond: [{ $eq: ['$prioridad', 'Alta'] }, 1, 0] }
                    },
                    prioridad_urgente: {
                        $sum: { $cond: [{ $eq: ['$prioridad', 'Urgente'] }, 1, 0] }
                    }
                }
            },
            { $sort: { count: -1 } }
        ]);

        estadisticas.forEach(stat => {
            console.log(`   - ${stat._id}: ${stat.count} denuncias`);
            if (stat.prioridad_alta > 0) {
                console.log(`     • Alta prioridad: ${stat.prioridad_alta}`);
            }
            if (stat.prioridad_urgente > 0) {
                console.log(`     • Urgente: ${stat.prioridad_urgente}`);
            }
        });

        // Mostrar denuncias sin personal asignado en estado "En proceso"
        const sinPersonal = await Denuncia.countDocuments({
            estado: 'En proceso',
            personalAsignado: null,
            isDeleted: false
        });

        if (sinPersonal > 0) {
            console.log(`\n⚠️  Atención: ${sinPersonal} denuncias en "En proceso" sin personal asignado`);
        }

        // Mostrar denuncias sin respuesta predeterminada
        const sinRespuesta = await Denuncia.countDocuments({
            'respuestaPredeterminada.mensaje': null,
            estado: { $ne: 'En revisión' },
            isDeleted: false
        });

        if (sinRespuesta > 0) {
            console.log(`\nℹ️  ${sinRespuesta} denuncias sin respuesta predeterminada asignada`);
        }

    } catch (error) {
        console.error('❌ Error general en la migración:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ Conexión cerrada');
        process.exit(0);
    }
};

// Ejecutar
(async () => {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   MIGRACIÓN DE DENUNCIAS - NUEVOS CAMPOS              ║');
    console.log('║   Sistema de Gestión de Denuncias Ciudadanas          ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    await connectDB();
    await migrarDenuncias();
})();
