const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true, 
    lowercase: true 
  }
}, {
  
  timestamps: true 
});

// Índice para mejorar el rendimiento de las consultas por nombre de etiqueta.
//tagSchema.index({ name: 1 }); (Lo comenté porque me salía un warning)

module.exports = mongoose.model('Tag', tagSchema);