/**
 * Script para crear personal municipal de prueba
 * 
 * Ejecutar con: node scripts/createTestPersonal.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const PersonalMunicipal = require('../src/Models/personalMunicipal');

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

// Personal de prueba
const personalPrueba = [
    {
        nombreCompleto: 'Juan Pérez González',
        cedula: '1234567890',
        cargo: 'Inspector de Obras Públicas',
        departamento: 'Obras Públicas y Movilidad',
        especialidad: 'Infraestructura vial y bacheo',
        telefono: '0987654321',
        email: 'juan.perez@municipio.gob.ec',
        estado: 'Activo'
    },
    {
        nombreCompleto: 'María Rodríguez López',
        cedula: '0987654321',
        cargo: 'Técnica en Saneamiento',
        departamento: 'Gestión Ambiental',
        especialidad: 'Recolección de desechos y limpieza',
        telefono: '0991234567',
        email: 'maria.rodriguez@municipio.gob.ec',
        estado: 'Activo'
    },
    {
        nombreCompleto: 'Carlos Méndez Torres',
        cedula: '1122334455',
        cargo: 'Ingeniero Hidráulico',
        departamento: 'Agua Potable y Alcantarillado',
        especialidad: 'Sistemas de agua potable',
        telefono: '0976543210',
        email: 'carlos.mendez@municipio.gob.ec',
        estado: 'Activo'
    },
    {
        nombreCompleto: 'Ana Martínez Silva',
        cedula: '5544332211',
        cargo: 'Inspectora de Control Urbano',
        departamento: 'Control Urbano y Construcciones',
        especialidad: 'Permisos de construcción y ornato',
        telefono: '0965432109',
        email: 'ana.martinez@municipio.gob.ec',
        estado: 'Activo'
    },
    {
        nombreCompleto: 'Luis García Ramírez',
        cedula: '6677889900',
        cargo: 'Técnico en Alcantarillado',
        departamento: 'Agua Potable y Alcantarillado',
        especialidad: 'Alcantarillado sanitario y pluvial',
        telefono: '0954321098',
        email: 'luis.garcia@municipio.gob.ec',
        estado: 'Activo'
    },
    {
        nombreCompleto: 'Patricia Sánchez Vega',
        cedula: '9988776655',
        cargo: 'Coordinadora de Movilidad',
        departamento: 'Obras Públicas y Movilidad',
        especialidad: 'Transporte y señalización',
        telefono: '0943210987',
        email: 'patricia.sanchez@municipio.gob.ec',
        estado: 'Activo'
    },
    {
        nombreCompleto: 'Roberto Flores Castro',
        cedula: '1357924680',
        cargo: 'Técnico Ambiental',
        departamento: 'Gestión Ambiental',
        especialidad: 'Gestión de residuos y reciclaje',
        telefono: '0932109876',
        email: 'roberto.flores@municipio.gob.ec',
        estado: 'Activo'
    },
    {
        nombreCompleto: 'Carmen Díaz Morales',
        cedula: '2468013579',
        cargo: 'Arquitecta Municipal',
        departamento: 'Control Urbano y Construcciones',
        especialidad: 'Planificación urbana',
        telefono: '0921098765',
        email: 'carmen.diaz@municipio.gob.ec',
        estado: 'Activo'
    }
];

// Función principal
const crearPersonalPrueba = async () => {
    try {
        console.log('🚀 Iniciando creación de personal de prueba...\n');

        // Limpiar personal existente (opcional - comentar si no se desea)
        // await PersonalMunicipal.deleteMany({});
        // console.log('🗑️  Personal existente eliminado\n');

        // Crear personal
        let creados = 0;
        let errores = 0;

        for (const personal of personalPrueba) {
            try {
                // Verificar si ya existe
                const existe = await PersonalMunicipal.findOne({ cedula: personal.cedula });
                
                if (existe) {
                    console.log(`⚠️  Personal ya existe: ${personal.nombreCompleto} (${personal.cedula})`);
                    continue;
                }

                const nuevoPersonal = new PersonalMunicipal(personal);
                await nuevoPersonal.save();
                
                console.log(`✅ Creado: ${personal.nombreCompleto}`);
                console.log(`   - Departamento: ${personal.departamento}`);
                console.log(`   - Cargo: ${personal.cargo}`);
                console.log(`   - ID: ${nuevoPersonal._id}\n`);
                
                creados++;
            } catch (error) {
                console.error(`❌ Error creando ${personal.nombreCompleto}:`, error.message);
                errores++;
            }
        }

        console.log('\n📊 Resumen:');
        console.log(`   ✅ Creados exitosamente: ${creados}`);
        console.log(`   ❌ Errores: ${errores}`);
        console.log(`   📋 Total procesados: ${personalPrueba.length}`);

        // Mostrar resumen por departamento
        console.log('\n📈 Personal por Departamento:');
        const personal = await PersonalMunicipal.find({ isDeleted: false });
        const porDepartamento = personal.reduce((acc, p) => {
            acc[p.departamento] = (acc[p.departamento] || 0) + 1;
            return acc;
        }, {});

        Object.entries(porDepartamento).forEach(([dept, count]) => {
            console.log(`   - ${dept}: ${count} personas`);
        });

    } catch (error) {
        console.error('❌ Error general:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ Conexión cerrada');
        process.exit(0);
    }
};

// Ejecutar
(async () => {
    await connectDB();
    await crearPersonalPrueba();
})();
