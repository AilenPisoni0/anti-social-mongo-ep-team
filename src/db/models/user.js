const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nickName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/ 
  },
  isEdited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, //esto crea el CreateAt y EditedAt automáticamente
});

UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'userId'
});

UserSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'userId'
});

//Esto incluye los virtuals, renombra _id a id (solo en las res) y elimina el campo __v
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
UserSchema.set('toObject', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('User', UserSchemaSchema);