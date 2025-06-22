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

postSchema.index({ userId: 1, createdAt: -1 });

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

postSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
postSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Post', postSchema);