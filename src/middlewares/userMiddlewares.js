const User = require("../db/models/user")

const existUserByAttribute = (attribute) => {
    return async (req, res, next) => {
        const value = req.body[attribute];
        if (value) {
            const userId = req.params.id;
            let query = { [attribute]: value };

            if (userId) {
                // Es una actualización, excluimos el usuario actual
                query._id = { $ne: userId };
            }

            const data = await User.findOne(query);
            if (data) {
                return res.status(400).json({ error: `El ${attribute} ${value} ya está registrado` })
            }
        }
        next()
    }
}


const existUserModelById = (modelo) => {
    return async (req, res, next) => {
        const userId = req.body.userId;
        if (userId) {
            const data = await modelo.findById(userId);
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