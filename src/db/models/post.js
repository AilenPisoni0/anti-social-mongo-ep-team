// src/models/Post.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definimos el esquema para el documento Post.
// Este esquema describe la estructura y los tipos de datos
// que un documento 'Post' tendrá en nuestra colección de MongoDB.
const postSchema = new Schema({
  // Referencia al usuario que creó el post.
  // Es un ObjectId que apunta a un documento en la colección 'User'.
  // Esto es una "Referencia" (similar a una clave foránea en SQL),
  // como se explicó en el material de Mongoose.
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // El nombre del modelo al que hace referencia
    required: true // Un post siempre debe tener un creador
  },
  
  // Descripción del post, un campo de texto obligatorio.
  description: {
    type: String,
    required: true,
    trim: true // Elimina espacios en blanco del inicio y fin
  },
  
  // Array de objetos embebidos para las imágenes.
  // Esto es un ejemplo de "Incrustación" (Embedding) en MongoDB,
  // donde los documentos de imagen se guardan directamente dentro del documento Post.
  // Se usa cuando los subdocumentos están fuertemente relacionados y raramente
  // se consultarán de forma independiente.
  images: [{
    url: { // URL de la imagen (ej. /uploads/nombre_archivo.jpg)
      type: String,
      required: true,
      trim: true
    },
    description: { // Descripción opcional de la imagen
      type: String,
      trim: true
    },
    uploadedAt: { // Fecha/hora de subida de la imagen
      type: Date,
      default: Date.now
    }
  }],
  
  // Array de referencias a etiquetas (tags).
  // Es una relación muchos-a-muchos modelada con "Referencias".
  // Cada elemento en el array es un ObjectId que apunta a un documento en la colección 'Tag'.
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag' // El nombre del modelo al que hace referencia
  }]
}, {
  // Opciones del esquema:
  timestamps: true, // Mongoose gestiona automáticamente createdAt y updatedAt
  // (createdAt: fecha de creación del documento, updatedAt: fecha de última modificación)
  
  // No se incluyen 'isEdited' ni 'deletedAt' explícitamente aquí,
  // ya que 'updatedAt' cubre 'isEdited' y para 'deletedAt' se preferiría
  // un campo 'isActive' o un borrado físico para un MVP, a menos que se especifique.
});

// Índices para mejorar el rendimiento de las consultas frecuentes.
// Por ejemplo:
// - Buscar posts de un usuario específico, ordenados por fecha de creación descendente.
postSchema.index({ userId: 1, createdAt: -1 });
// - Buscar posts que contengan una etiqueta específica.
postSchema.index({ tags: 1 });

// Exportamos el modelo 'Post' para que pueda ser utilizado
// en otras partes de la aplicación (ej., en los controladores).
module.exports = mongoose.model('Post', postSchema);