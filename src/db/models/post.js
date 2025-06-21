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

  tags: [{
    type: Schema.Types.ObjectId,

    ref: 'Tag'
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

// Virtual para obtener las imágenes del post desde la colección PostImage
postSchema.virtual('postImages', {
  ref: 'PostImage',
  localField: '_id',
  foreignField: 'postId'
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);