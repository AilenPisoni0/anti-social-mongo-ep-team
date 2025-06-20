const User= require('../db/models/user');
const  Post =require('../db/models/post');
const Comment =require('../db/models/comment');
const { redisClient } = require('../db/config/redisClient'); 

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
    await redisClient.del('users:todos'); // clave coherente con getAllUsers

    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'No se pudo crear el usuario' });
  }
},

  // Obtener todos los usuarios
  getAllUsers: async (req, res) => {
    const cacheKey = 'users:todos'
    try {
    const cached = await redisClient.get(cacheKey);

        if(cached){
           console.log(' Respuesta desde Redis');
            return res.status(200).json(JSON.parse(cached))
        }
     const users = await User.find({}, 'nickName email createdAt').lean()
    await redisClient.set(cacheKey, JSON.stringify(users), { EX: 300});

      res.status(200).json(users);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
  res.status(500).json({ error: 'No se pudieron obtener los usuarios', detalles: err.message });
    }
  },

  // Obtener un usuario por ID con sus posts
  getUserById: async (req, res) => {
  try {
    const id = req.params.id
    const cacheKey = `user:${id}`
    const cached = await redisClient.get(cacheKey)
        if(cached){
          console.log('desde redis')
            return res.status(200).json(JSON.parse(cached))
        }
    const user = await User.findById(id)
      .select('id nickName email createdAt') // selecciona sólo estos campos
      .populate({
        path: 'posts',
        populate: {
          path: 'comments',
          select: 'id content createdAt'
    
        }
      });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await redisClient.set(cacheKey, JSON.stringify(user), { EX: 300 })

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'No se pudo obtener el usuario'});
  }
},

  // Actualizar un usuario
  updateUser: async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    user.isEdited = true;
    user.set(req.body); // asigna las propiedades del body al modelo
     await redisClient.del(`user:${req.params.id}`)
    await redisClient.del('users:todos')
    await user.save();
    
    res.status(200).json(user);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ error: 'El email ya existe' });
    }
    res.status(500).json({ error: 'No se pudo actualizar el usuario', details: err.message });
  }
},

  // Eliminar (soft delete) un usuario
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
        await redisClient.del(`user:${id}`);
        await redisClient.del('users:todos')
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'No se pudo eliminar el usuario' });
    }
  }
}

;



