require('dotenv').config();
const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Conectado a mongoDB")
  } catch (error) {
    console.log("Error a conectar a mongoDB", error.message)
  }
}

module.exports= conectarDB

// module.exports = {
//   development: {
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD || null,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT
//   },
//   test: {
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD || null,
//     database: process.env.DB_NAME + '_test',
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT
//   },
//   production: {
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD || null,
//     database: process.env.DB_NAME + '_prod',
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT
//   }
// };