const { User } = require("../db/models")

const existUserByAttribute = (attribute) => {
    return async (req, res, next) => {
        const value = req.body[attribute];
        if (value) {
            const data = await User.findOne({ where: { [attribute]: value } });
            if (data) {
                return res.status(404).json({ message: `El ${attribute} ${value} ya está registrado` })
            }
        }
        next()
    }
}


const existUserModelById = (modelo) => {
  return async (req, res, next) => {
    const userId = req.body.userId;
    if(userId){
        const data = await modelo.findByPk(userId);
        if (!data) {
        return res
            .status(404)
            .json({ message: `El user id ${userId} no se encuentra registrado` });
        }
    }
    next();
  };
}

module.exports = { existUserByAttribute, existUserModelById }