const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { genericMiddleware, userMiddleware, postMiddleware } = require("../middlewares");
const { UserSchema, UpdateUserSchema } = require("../schemas/");
const User = require("../db/models/user");

//POST - Crear usuario
router.post('/',
  genericMiddleware.schemaValidator(UserSchema),
  userMiddleware.existUserByAttribute('nickName'),
  userMiddleware.existUserByAttribute('email'),
  userController.createUser
);

//GET - Obtener todos los usuarios
router.get('/', userController.getAllUsers);

//GET - Obtener usuario por ID
router.get('/:id',
  genericMiddleware.validateMongoId,
  genericMiddleware.createEntityExistsValidator(User, 'Usuario'),
  userController.getUserById
);

//PUT - Actualizar usuario
router.put('/:id',
  genericMiddleware.validateMongoId,
  genericMiddleware.createEntityExistsValidator(User, 'Usuario'),
  genericMiddleware.schemaValidator(UpdateUserSchema),
  userMiddleware.existUserByAttribute('email'),
  userController.updateUser
);

//DELETE - Eliminar usuario con efecto cascada
router.delete('/:id',
  genericMiddleware.validateMongoId,
  postMiddleware.deleteUserWithCascade,
  userController.deleteUser
);

module.exports = router;