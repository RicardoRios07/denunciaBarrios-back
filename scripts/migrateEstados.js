/**
 * Script de migración de denuncias
 * Ejecutar: node scripts/migrateEstados.js
 * 
 * Este script migra las denuncias existentes al nuevo formato:
 * 1. Mapea estados antiguos a nuevos
 * 2. Convierte campo evidencia de String a Array
 * 3. Renombra personalAsignado a assigneeId
 */

require('dotenv').config();
const mongoose = require('mongoose');

// URI de conexión
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/barrios';

// Mapeo de estados antiguos a nuevos
const estadoMap = {
  'En revisión': 'REVISION',
  'En proceso': 'EN_PROCESO',
  'Atendida': 'ATENDIDA',
  'No procede': 'INVALIDA'
};

async function migrate() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'barrios'
    });
    console.log('✓ Conectado a la base de datos');

    const db = mongoose.connection.db;
    const denunciasCollection = db.collection('denuncias');

    // Contar denuncias a migrar
    const totalDenuncias = await denunciasCollection.countDocuments({});
    console.log(`\nTotal de denuncias a migrar: ${totalDenuncias}`);

    if (totalDenuncias === 0) {
      console.log('No hay denuncias para migrar.');
      await mongoose.disconnect();
      return;
    }

    // Obtener todas las denuncias
    const denuncias = await denunciasCollection.find({}).toArray();
    
    let migratedCount = 0;
    let errorCount = 0;

    console.log('\nIniciando migración...\n');

    for (const denuncia of denuncias) {
      try {
        const updates = {};

        // 1. Migrar estado
        if (denuncia.estado && estadoMap[denuncia.estado]) {
          updates.estado = estadoMap[denuncia.estado];
        } else if (!denuncia.estado) {
          updates.estado = 'REVISION';
        }

        // 2. Convertir evidencia de String a Array
        if (denuncia.evidencia && typeof denuncia.evidencia === 'string') {
          updates.evidencia = [denuncia.evidencia];
        } else if (!denuncia.evidencia) {
          // Si no tiene evidencia, crear array vacío (aunque el schema requiere al menos 1)
          console.warn(`⚠ Denuncia ${denuncia._id} no tiene evidencia`);
        }

        // 3. Renombrar personalAsignado a assigneeId
        if (denuncia.personalAsignado !== undefined) {
          updates.assigneeId = denuncia.personalAsignado;
          // Eliminar el campo antiguo
          await denunciasCollection.updateOne(
            { _id: denuncia._id },
            { $unset: { personalAsignado: "" } }
          );
        }

        // 4. Actualizar historialEstados si existe
        if (denuncia.historialEstados && Array.isArray(denuncia.historialEstados)) {
          const nuevoHistorial = denuncia.historialEstados.map(item => {
            if (item.estado && estadoMap[item.estado]) {
              return { ...item, estado: estadoMap[item.estado] };
            }
            return item;
          });
          updates.historialEstados = nuevoHistorial;
        }

        // Aplicar actualizaciones
        if (Object.keys(updates).length > 0) {
          await denunciasCollection.updateOne(
            { _id: denuncia._id },
            { $set: updates }
          );
          migratedCount++;
          
          process.stdout.write(`\rMigradas: ${migratedCount}/${totalDenuncias}`);
        }

      } catch (error) {
        errorCount++;
        console.error(`\n✗ Error migrando denuncia ${denuncia._id}:`, error.message);
      }
    }

    console.log('\n\n=== Resumen de Migración ===');
    console.log(`✓ Migradas exitosamente: ${migratedCount}`);
    console.log(`✗ Errores: ${errorCount}`);
    console.log(`Total procesadas: ${totalDenuncias}`);
    console.log('\n✓ Migración completada\n');

    // Verificar algunas denuncias migradas
    console.log('Verificando migración...');
    const sample = await denunciasCollection.findOne({});
    if (sample) {
      console.log('\nEjemplo de denuncia migrada:');
      console.log(`- ID: ${sample._id}`);
      console.log(`- Estado: ${sample.estado}`);
      console.log(`- Evidencia: ${Array.isArray(sample.evidencia) ? 'Array ✓' : 'String ✗'}`);
      console.log(`- assigneeId: ${sample.assigneeId || 'null'}`);
      console.log(`- personalAsignado (debe no existir): ${sample.personalAsignado !== undefined ? '✗ AÚN EXISTE' : '✓ eliminado'}`);
    }

    await mongoose.disconnect();
    console.log('\n✓ Desconectado de la base de datos');
    process.exit(0);

  } catch (error) {
    console.error('\n✗ Error durante la migración:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Ejecutar migración
console.log('===========================================');
console.log('  SCRIPT DE MIGRACIÓN DE DENUNCIAS');
console.log('===========================================\n');

migrate();
