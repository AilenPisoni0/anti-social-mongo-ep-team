// main.js (en la raíz del proyecto)

console.log("UnaHur - Anti-Social net");

const express = require('express');
const app = express();
const path = require('path');

// IMPORTACIÓN CORREGIDA: Ahora apunta directamente a db/config/config (dentro de src)
const conectarDB = require('./src/db/config/config');

// IMPORTACIONES CORREGIDAS: Ahora apuntan directamente a routes (dentro de src)
const { userRoute, commentRoute, tagRoute, postRoute } = require("./src/routes");

// IMPORTACIÓN CORREGIDA: Ahora apunta directamente a docs/swagger (dentro de src)
const { specs, swaggerUi } = require('./src/docs/swagger');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sirve archivos estáticos desde la carpeta 'uploads'
// Esta ruta está bien porque '../uploads' significa:
// desde la raíz del proyecto, sube un nivel (no hay nada más arriba), y luego busca 'uploads'.
// Esto funciona porque main.js está en la raíz, y 'uploads' también está en la raíz.
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Corregido: '__dirname' es la raíz del proyecto, entonces solo 'uploads'

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use('/tags', tagRoute);
app.use("/comments", commentRoute);

const startServer = async () => {
  try {
    await conectarDB();

    app.listen(PORT, () => {
      console.log(`Aplicación UnaHur - Anti-Social Net corriendo exitosamente en el puerto ${PORT}`);
      console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
  });
});