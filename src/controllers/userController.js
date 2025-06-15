const User= require('../db/models/user');
const  Post =require('../db/models/post');
const Comment =require('../db/models/comment');
module.exports = {
  // Crear un nuevo usuario
 createUser: async (req, res) => {
  try {
    const { nickName, email } = req.body;

    const newUser = new User({
      nickName,
      email,
      isEdited: false
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo crear el usuario' });
  }
},

  // Obtener todos los usuarios
  getAllUsers: async (req, res) => {
    try {
     const users = await User.find({}, 'nickName email createdAt').lean()
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: 'No se pudieron obtener los usuarios' });
    }
  },

  // Obtener un usuario por ID con sus posts
  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: ['id', 'nickName', 'email', 'createdAt'],
        include: [{
          model: Post,
          include: [{
            model: Comment,
            attributes: ['id', 'content', 'createdAt']
          }]
        }]
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: 'No se pudo obtener el usuario' });
    }
  },

  // Actualizar un usuario
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      user.isEdited = true;
      await user.update(req.body);

      res.status(200).json(user);
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'El email ya existe' });
      }
      res.status(500).json({ error: 'No se pudo actualizar el usuario' });
    }
  },

  // Eliminar (soft delete) un usuario
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      await user.destroy();
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'No se pudo eliminar el usuario' });
    }
  }
};



