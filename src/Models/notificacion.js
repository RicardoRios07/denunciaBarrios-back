const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'userModel'
    },
    userModel: {
      type: String,
      required: true,
      enum: ['User', 'Admin', 'PersonalMunicipal']
    },
    type: {
      type: String,
      required: true,
      enum: [
        'denuncia_creada',
        'denuncia_validada',
        'denuncia_invalida',
        'denuncia_no_atendible',
        'denuncia_asignada',
        'denuncia_en_proceso',
        'denuncia_atendida'
      ]
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    readAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índices para optimizar queries
notificacionSchema.index({ userId: 1, readAt: 1 });
notificacionSchema.index({ userId: 1, createdAt: -1 });

const Notificacion = mongoose.model('Notificacion', notificacionSchema);

module.exports = Notificacion;
