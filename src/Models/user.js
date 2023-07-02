/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         nombreCompleto:
 *           type: string
 *           minLength: 6
 *           maxLength: 255
 *         cedula:
 *           type: string
 *           minLength: 6
 *           maxLength: 10
 *         numTelefono:
 *           type: string
 *           minLength: 6
 *           maxLength: 10
 *         email:
 *           type: string
 *           minLength: 6
 *           maxLength: 1024
 *         password:
 *           type: string
 *           minLength: 6
 *         role:
 *           type: string
 *           default: USER
 */

const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const rolesValidos = {
  values: ["USER"],
  message: "{VALUE} no es un rol válido",
};

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    nombreCompleto: {
      type: String,
      required: true,
      min: 3,
      max: 255,
      trim: true,
    },
    cedula: {
      type: String,
      unique: true,
      required: true,
      min: 6,
      max: 10,
      trim: true,
    },
    numTelefono: {
      type: String,
      unique: true,
      required: true,
      min: 6,
      max: 10,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      min: 6,
      max: 255,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      trim: true,
    },
    role: {
      type: String,
      default: "USER",
      enum: rolesValidos,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser único",
});

module.exports = mongoose.model("User", userSchema);
