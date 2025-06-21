console.log("UnaHur - Anti-Social net");
const express = require('express')
const app = express()
//const redisClient =  require('./db/config/redisClient')
const { redisClient, connectRedis } = require('./db/config/redisClient');
const conectarDB = require('./db/config/config')
const { userRoute, commentRoute, tagRoute, postRoute, postImageRoute } = require("./routes");
const { specs, swaggerUi } = require('./docs/swagger');

require('dotenv').config()

const PORT = process.env.PORT || 3000

app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use('/tags', tagRoute);
app.use("/comments", commentRoute);
app.use("/post-images", postImageRoute);

// conexion a bases de datos
conectarDB()
redisClient.connect()
  .then(() => console.log('Conectado a redis'))
  .catch(console.error)
connectRedis()
  .then(() => console.log('Conectado a Redis'))
  .catch(console.error);

app.listen(PORT, async () => {
  console.log(`Aplicación corriendo exitosamente en el puerto ${PORT}`)
})