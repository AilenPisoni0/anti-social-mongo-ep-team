const Comment = require('../db/models/comment');
const User = require('../db/models/user');
const mongoose = require('mongoose');

module.exports = {
  // Crear un nuevo comentario
  createComment: async (req, res) => {
  try {
    const { content, userId, postId } = req.body;

    
    const newComment = new Comment({
      content,
      userId,
      postId,
      isEdited: false
    });

    await newComment.save();

  
    const commentWithUser = await Comment.findById(newComment._id)
      .populate({
        path: 'userId',
        select: 'nickName'
      });

    res.status(201).json(commentWithUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo crear el comentario' });
  }
},

  // Obtener comentarios de un post específico (solo recientes)
 getPostComments: async (req, res) => {
  try {
    const { id } = req.params;


    const maxAgeMonths = parseInt(process.env.MAX_COMMENT_AGE_MONTHS) || 6;

    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

    const comments = await Comment.find({
      postId: id,
      createdAt: { $gte: cutoffDate }
    })
    .populate('userId', 'nickName')
    .sort({ createdAt: -1 });

    if (comments.length === 0) {
      return res.status(204).json({ message: 'No hay comentarios para mostrar' });
    }

    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudieron obtener los comentarios' });
  }
},

  // Obtener todos los comentarios
  getAllComments: async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate({
        path: 'userId',
        select: 'nickName' // solo traemos el nickName del usuario
      })
      .sort({ createdAt: -1 }); // orden descendente por fecha

    if (comments.length === 0) {
      return res.status(204).json({ message: 'No hay comentarios para mostrar' });
    }

    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudieron obtener los comentarios' });
  }
},
  // Obtener un comentario por ID
 getCommentById: async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id)
      .populate('userId', 'nickName'); 
    if (!comment) {
      return res.status(204).json({ message: 'No hay comentarios para mostrar' });
    }

    res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo obtener el comentario' });
  }
},

  // Actualizar un comentario (contenido y/o fecha)
 updateComment: async (req, res) => {
  try {
    const { id } = req.params;
    const { content, createdAt } = req.body;

    const updates = {};
    if (content) {
      updates.content = content;
      updates.isEdited = true;
    }
    if (createdAt) {
      updates.createdAt = new Date(createdAt);
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true } 
    ).populate('userId', 'nickName'); 

    if (!updatedComment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    res.status(201).json(updatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo actualizar el comentario' });
  }
},


  // Eliminar un comentario
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;

      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ error: 'Comentario no encontrado' });
      }

       await comment.deleteOne(); 

      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo eliminar el comentario' });
    }
  },
};
