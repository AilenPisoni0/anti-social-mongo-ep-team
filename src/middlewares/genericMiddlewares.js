

const validateId =  (req,res,next)=>{
    const id = req.params.id;
    if(id<=0){
        res.status(400).json({message:`El id no puede ser un número negativo`})
    }
    next()
}

const existModelById = (modelo) => {
  return async (req, res, next) => {
    const id = req.params.id;
    const data = await modelo.findByPk(id);
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
    const data = await modelo.findByPk(id);
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
    const data = await modelo.findByPk(id);
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
    const { error, _ } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errores = error.details.map((e) => {
        return { atribulo: e.path[0], mensaje: e.message};
      });
      return res.status(400).json({ errores });
    }
    next();
  };
};


module.exports = {existModelById, validateId, schemaValidator, existModelByPostIdInBody, existModelByUserIdInBody}