const mongoose = require('mongoose');

const reporteAtencionSchema = new mongoose.Schema(
    {
        denunciaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Denuncia',
            required: true
        },
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PersonalMunicipal',
            required: true
        },
        descripcion: {
            type: String,
            required: true,
            trim: true,
            minlength: [20, 'La descripción debe tener al menos 20 caracteres']
        },
        evidencia: {
            type: [String],
            default: [],
            validate: {
                validator: function (v) {
                    return v.length <= 10;
                },
                message: 'No puede subir más de 10 evidencias'
            }
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Índice para búsquedas rápidas por denuncia
reporteAtencionSchema.index({ denunciaId: 1 });
reporteAtencionSchema.index({ staffId: 1 });

const ReporteAtencion = mongoose.model('ReporteAtencion', reporteAtencionSchema);

module.exports = ReporteAtencion;
