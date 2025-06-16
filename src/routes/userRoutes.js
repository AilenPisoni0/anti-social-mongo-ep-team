const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { genericMiddleware, userMiddleware } = require("../middlewares");
const { UserSchema } = require("../schemas/");
const  User  = require("../db/models/user");

//POST OK
router.post('/',
  genericMiddleware.schemaValidator(UserSchema),
  userMiddleware.existUserByAttribute('nickName'),
  userMiddleware.existUserByAttribute('email'),
  userController.createUser
);
//GETALL OK
router.get('/', userController.getAllUsers);

//GETBYID OK
router.get('/:id',
  genericMiddleware.validateId,
  genericMiddleware.existModelById(User),
  userController.getUserById
);
//UPDATE OK
router.put('/:id',
  genericMiddleware.validateId,
  genericMiddleware.existModelById(User),
  userMiddleware.existUserByAttribute('email'),
  userController.updateUser
);
//DELETEBYID OK (NO PUDE HACER EL SOFT DELETE)
router.delete('/:id',
  genericMiddleware.validateId,
  genericMiddleware.existModelById(User),
  userController.deleteUser
);

module.exports = router;