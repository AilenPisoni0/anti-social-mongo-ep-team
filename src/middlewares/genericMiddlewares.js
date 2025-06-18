const mongoose = require('mongoose');
const User = require('../db/models/user');
const Comment = require ('../db/models/comment');

const validateId =  (req,res,next)=>{
   const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: `El id ${id} no se encuentra registrado` });
  }
    next()
}

const existModelById = (modelo) => {
  return async (req, res, next) => {
    const id = req.params.id;
    const data = await modelo.findById(id);
    if (!data) {
      return res
        .status(404)
        .json({ message: `El id ${id} no se encuentra registrado` });
    }
    next();
  };
};

const existModelByUserIdInBody = (modelo) => {
  return async (req, res, next) => {
    const id = req.body.userId;
    const data = await modelo.findById(id);
    if (!data) {
      return res
        .status(404)
        .json({ message: `El userId ${id} no se encuentra registrado` });
    }
    next();
  };
};


const existModelByPostIdInBody = (modelo) => {
  return async (req, res, next) => {
    const id = req.body.postId;
    const data = await modelo.findById(id);
    if (!data) {
      return res
        .status(404)
        .json({ message: `El postId ${id} no se encuentra registrado` });
    }
    next();
  };
};



const schemaValidator = (schema) => {
    return (req, res, next) => {
        console.log("schemaValidator: req.body recibido:", req.body); // <-- ESTE LOG
        const { error, _ } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            console.log("schemaValidator: Error de Joi detectado:", error); // <-- Y ESTE LOG
            const errores = error.details.map((e) => {
                return { atribulo: e.path[0], mensaje: e.message};
            });
            console.log("schemaValidator: Errores mapeados para la respuesta:", errores); // <-- Y ESTE LOG
            return res.status(400).json({ errores });
        }
        next();
    };
};


module.exports = {existModelById, validateId, schemaValidator, existModelByPostIdInBody, existModelByUserIdInBody}