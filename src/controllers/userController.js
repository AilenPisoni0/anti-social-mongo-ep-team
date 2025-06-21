const User = require('../db/models/user');
const Post = require('../db/models/post');
const Comment = require('../db/models/comment');
const { redisClient } = require('../db/config/redisClient');

module.exports = {
  // POST - Crear un nuevo usuario
  createUser: async (req, res) => {
    try {
      const { nickName, email } = req.body;

      const newUser = new User({
        nickName,
        email,
        isEdited: false
      });

      await newUser.save();
      await redisClient.del('users:todos');

      return res.status(201).json(newUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'No se pudo crear el usuario' });
    }
  },

  // GET - Obtener todos los usuarios
  getAllUsers: async (req, res) => {
    const cacheKey = 'users:todos'
    try {
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        console.log('Respuesta desde Redis');
        const users = JSON.parse(cached);
        if (users.length === 0) {
          return res.status(204).send();
        }
        return res.status(200).json(users);
      }

      const users = await User.find({ isDeleted: false }, 'nickName email createdAt updatedAt').lean();

      if (users.length === 0) {
        return res.status(204).send();
      }

      await redisClient.set(cacheKey, JSON.stringify(users), { EX: 300 });

      res.status(200).json(users);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      res.status(500).json({ error: 'No se pudieron obtener los usuarios', detalles: err.message });
    }
  },

  // GET - Obtener un usuario por ID
  getUserById: async (req, res) => {
    try {
      const id = req.params.id;
      const cacheKey = `user:${id}`;

      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('Respuesta desde Redis');
        return res.status(200).json(JSON.parse(cached));
      }

      const user = await User.findOne({ _id: id, isDeleted: false })
        .select('nickName email createdAt updatedAt');

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      await redisClient.set(cacheKey, JSON.stringify(user), { EX: 300 });
      res.status(200).json(user);
    } catch (err) {
      console.error('Error al obtener usuario:', err);
      res.status(500).json({ error: 'No se pudo obtener el usuario' });
    }
  },

  // PUT - Actualizar un usuario
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;

      // El middleware ya verificó que el usuario existe
      const user = await User.findById(id);

      user.isEdited = true;
      user.set(req.body);

      await user.save();
      await redisClient.del(`user:${id}`);
      await redisClient.del('users:todos');

      res.status(201).json(user);
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      res.status(500).json({ error: 'No se pudo actualizar el usuario' });
    }
  },

  // DELETE - Eliminar un usuario con efecto cascada
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      // El middleware ya eliminó los elementos asociados y verificó que el usuario existe
      await User.findByIdAndDelete(id);

      await redisClient.del(`user:${id}`);
      await redisClient.del('users:todos');
      res.status(204).send();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      res.status(500).json({ error: 'No se pudo eliminar el usuario' });
    }
  }
};



