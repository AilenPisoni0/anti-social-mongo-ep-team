const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { genericMiddleware, userMiddleware } = require("../middlewares");
const { UserSchema } = require("../schemas/");
const { User } = require("../db/models");

router.post('/',
  genericMiddleware.schemaValidator(UserSchema),
  userMiddleware.existUserByAttribute('nickName'),
  userMiddleware.existUserByAttribute('email'),
  userController.createUser
);

router.get('/', userController.getAllUsers);

router.get('/:id',
  genericMiddleware.validateId,
  genericMiddleware.existModelById(User),
  userController.getUserById
);

router.put('/:id',
  genericMiddleware.validateId,
  genericMiddleware.existModelById(User),
  userMiddleware.existUserByAttribute('email'),
  userController.updateUser
);

router.delete('/:id',
  genericMiddleware.validateId,
  genericMiddleware.existModelById(User),
  userController.deleteUser
);

module.exports = router;