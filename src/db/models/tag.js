// src/models/Tag.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definimos el esquema para el documento Tag.
// Una etiqueta es una entidad sencilla con un nombre único.
const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Asegura que no haya etiquetas duplicadas por nombre
    trim: true,   // Elimina espacios en blanco del inicio y fin
    lowercase: true // Almacena los nombres de las etiquetas en minúsculas para consistencia
  }
}, {
  // Opciones del esquema:
  timestamps: true // Mongoose añade automáticamente createdAt y updatedAt
  // (createdAt: fecha de creación del documento, updatedAt: fecha de última modificación)
  
  // 'isEdited' y 'deletedAt' se eliminan, similar al modelo Post.
  // 'updatedAt' es suficiente para saber cuándo se modificó el nombre de la etiqueta.
});

// Índice para mejorar el rendimiento de las consultas por nombre de etiqueta.
tagSchema.index({ name: 1 });

// Exportamos el modelo 'Tag' para que pueda ser utilizado
// en otras partes de la aplicación (ej., en los controladores o en el modelo Post).
module.exports = mongoose.model('Tag', tagSchema);