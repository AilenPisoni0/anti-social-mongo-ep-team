require('dotenv').config();
const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Conectado a mongoDB")
  } catch (error) {
    console.log("Error a conectar a mongoDB", error.message)
  }
};

module.exports = conectarDB;
