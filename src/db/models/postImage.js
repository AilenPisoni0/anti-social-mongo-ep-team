const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postImageSchema = new Schema({
    url: {
        type: String,
        required: true,
        trim: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
}, {
    timestamps: true
});

// Índices para mejorar el rendimiento
postImageSchema.index({ postId: 1 });
postImageSchema.index({ url: 1 });

// Virtual para obtener el post asociado
postImageSchema.virtual('post', {
    ref: 'Post',
    localField: 'postId',
    foreignField: '_id',
    justOne: true
});

postImageSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

postImageSchema.set('toObject', {
    virtuals: true,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('PostImage', postImageSchema); 