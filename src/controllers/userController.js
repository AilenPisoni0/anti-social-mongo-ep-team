const User = require('../db/models/user');
const Post = require('../db/models/post');
const Comment = require('../db/models/comment');
const { redisClient, CACHE_TTL } = require('../db/config/redisClient');

// Helper para invalidar cachés relacionados con usuarios
const invalidateUserCaches = async (userId = null) => {
  if (userId) {
    await redisClient.del(`user:${userId}`);
  }
  await redisClient.del('users:todos');
};

module.exports = {
  // Crear un nuevo usuario
  createUser: async (req, res) => {
    try {
      const { nickName, email } = req.body;

      const newUser = new User({
        nickName,
        email
      });

      await newUser.save();
      await invalidateUserCaches();

      res.status(201).json(newUser);
    } catch (err) {
      if (err.code === 11000 && err.keyPattern?.nickName) {
        return res.status(400).json({ error: 'Ya existe un usuario con ese nickName' });
      }
      if (err.code === 11000 && err.keyPattern?.email) {
        return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
      }
      console.error(err);
      res.status(500).json({ error: 'No se pudo crear el usuario' });
    }
  },

  // Obtener todos los usuarios
  getAllUsers: async (req, res) => {
    const cacheKey = 'users:todos';
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        const users = JSON.parse(cached);
        return users.length === 0 ? res.status(204).send() : res.status(200).json(users);
      }

      const users = await User.find({}, 'nickName email createdAt updatedAt');

      if (users.length === 0) {
        return res.status(204).send();
      }

      await redisClient.set(cacheKey, JSON.stringify(users), { EX: CACHE_TTL.USERS });
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudieron obtener los usuarios' });
    }
  },

  // Obtener un usuario por ID
  getUserById: async (req, res) => {
    const { id } = req.params;
    const cacheKey = `user:${id}`;
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }

      const user = await User.findById(id)
        .select('nickName email createdAt updatedAt');

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      await redisClient.set(cacheKey, JSON.stringify(user), { EX: CACHE_TTL.USERS });
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'No se pudo obtener el usuario' });
    }
  },

  // Actualizar un usuario
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;

      // El middleware ya verificó que el usuario existe
      const user = await User.findById(id);

      user.set(req.body);

      await user.save();
      await invalidateUserCaches(id);

      res.status(200).json(user);
    } catch (err) {
      if (err.code === 11000 && err.keyPattern?.nickName) {
        return res.status(400).json({ error: 'Ya existe un usuario con ese nickName' });
      }
      if (err.code === 11000 && err.keyPattern?.email) {
        return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
      }
      console.error(err);
      res.status(500).json({ error: 'No se pudo actualizar el usuario' });
    }
  },

  // Eliminar un usuario
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;

      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Invalidar caché específica del usuario
      await invalidateUserCaches(userId);

      res.status(200).json({
        message: 'Usuario eliminado exitosamente',
        user: deletedUser
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};




