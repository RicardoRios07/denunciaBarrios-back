const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personalMunicipalSchema = new Schema({
    nombreCompleto: { 
        type: String, 
        required: true, 
    },
    cedula: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    cargo: {
        type: String,
        required: true,
        trim: true
    },
    departamento: {
        type: String,
        enum: [
            'Agua Potable y Alcantarillado',
            'Gestión Ambiental',
            'Obras Públicas y Movilidad',
            'Control Urbano y Construcciones'
        ],
        required: true
    },
    especialidad: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        trim: true
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo', 'En comisión', 'De vacaciones'],
        default: 'Activo'
    },
    denunciasAsignadas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Denuncia'
    }],
    denunciasResueltas: {
        type: Number,
        default: 0
    },
    calificacionPromedio: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    fechaIngreso: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    timestamps: true
});

const PersonalMunicipal = mongoose.model('PersonalMunicipal', personalMunicipalSchema);

module.exports = PersonalMunicipal;
