const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
  },
  
 
  description: {
    type: String,
    required: true,
    trim: true 
  },
  
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
  
  
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag' // El nombre del modelo al que hace referencia
  }]
}, {
  
  timestamps: true, 
});

// - Buscar posts de un usuario específico, ordenados por fecha de creación descendente.
postSchema.index({ userId: 1, createdAt: -1 });
// - Buscar posts que contengan una etiqueta específica.
postSchema.index({ tags: 1 });

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId' 
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);