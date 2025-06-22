# Anti-Social Network API

API REST para una red social antisocial. Desarrollada con Node.js, Express y MongoDB.

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- Docker y Docker Compose
- Git

### Pasos de instalación

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd anti-social-mongo-ep-team

# 2. Instalar dependencias
npm install

# 3. Iniciar servicios con Docker
docker-compose up -d

# 4. Ejecutar seeders para datos de prueba
npm run seed

# 5. Iniciar servidor
npm start
```

### Configuración del entorno

- **Puerto del servidor**: Configurado mediante variable de entorno `PORT` (por defecto: 3000)
- **Base de datos MongoDB**: Configurada mediante variable de entorno `MONGO_URI`
- **Redis**: Configurado mediante variable de entorno `REDIS_URL` (por defecto: redis://localhost:6379)
- **Filtrado de comentarios**: Configurado mediante variable de entorno `MAX_COMMENT_AGE_MONTHS` (por defecto: 6 meses)
- **Entorno**: Configurado mediante variable de entorno `NODE_ENV` (por defecto: development)

### Scripts disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar servidor en desarrollo con nodemon
npm run seed       # Ejecutar seeders para crear datos de prueba
```

## 📋 ¿Qué es esta API?

Una API REST completa para una red social que permite:

- **Gestión de usuarios** con nickName y email únicos
- **Publicaciones** con imágenes y tags
- **Sistema de comentarios** con filtrado por antigüedad configurable
- **Hard delete** implementado con cascada apropiada
- **Caché con Redis** para optimizar consultas
- **Validaciones robustas** con Joi
- **Documentación completa** con Swagger

## Estructura del Proyecto

```
anti-social-mongo-ep-team/
├── src/
│   ├── controllers/          # Lógica de negocio
│   ├── db/
│   │   ├── config/          # Configuración de DB y Redis
│   │   ├── models/          # Modelos de Mongoose
│   │   └── seeders/         # Datos de prueba
│   ├── docs/                # Documentación Swagger
│   ├── middlewares/         # Middlewares de validación
│   ├── routes/              # Definición de rutas
│   ├── schemas/             # Schemas de validación Joi
│   └── utils/               # Utilidades
├── postman/                 # Colecciones de prueba
├── docker-compose.yml       # Configuración de servicios
└── package.json
```

## Modelo de Datos

### Entidades Principales

#### Users
- `nickName` único
- `email` único
- Hard delete con cascada
- Timestamps automáticos

#### Posts
- `description` (requerido)
- `userId` (referencia a User)
- `tags` (array de referencias a Tags)
- Relaciones pobladas automáticamente
- Hard delete con cascada
- Timestamps automáticos

#### Comments
- `content` (requerido)
- `userId` (referencia a User)
- `postId` (referencia a Post)
- Filtrado por antigüedad configurable
- Hard delete
- Timestamps automáticos

#### Tags
- `name` único
- Relación muchos a muchos con posts
- Hard delete (solo desasocia)
- Timestamps automáticos

#### PostImages
- `url` (requerido)
- `postId` (referencia a Post)
- Hard delete
- Timestamps automáticos

## Endpoints de la API

### Base URL
```
http://localhost:3000
```

### Users

**GET /users** - Obtener todos los usuarios
```json
[
  {
    "id": "6856ea88be5012c571952977",
    "nickName": "usuario1",
    "email": "usuario1@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**GET /users/:id** - Obtener un usuario por ID

**POST /users** - Crear un usuario
```json
{
  "nickName": "john_doe_2",
  "email": "john2@example.com"
}
```

**PUT /users/:id** - Actualizar un usuario
```json
{
  "email": "john.updated@example.com"
}
```

**DELETE /users/:id** - Eliminar un usuario (hard delete con cascada)

### Posts

**GET /posts** - Obtener todos los posts (con relaciones pobladas)

**GET /posts/:id** - Obtener un post por ID (con relaciones pobladas)

**POST /posts** - Crear un post
```json
{
  "description": "Mi primer post en la red antisocial!",
  "userId": "6856ea88be5012c571952977",
  "tags": ["6856ea88be5012c57195297d"],
  "imagenes": ["https://ejemplo.com/imagen1.jpg"]
}
```

**PUT /posts/:id** - Actualizar un post
```json
{
  "description": "Post actualizado",
  "userId": "6856ea88be5012c571952978"
}
```

**DELETE /posts/:id** - Eliminar un post (hard delete con cascada)

### Post Images

**GET /posts/:id/images** - Obtener imágenes de un post

**POST /posts/:id/images** - Agregar imagen a un post
```json
{
  "url": "https://example.com/image.jpg"
}
```

**DELETE /posts/:id/images/:imageId** - Eliminar imagen de un post

### Post Tags

**GET /posts/:id/tags** - Obtener tags de un post

**POST /posts/:id/tags/:tagId** - Agregar tag a un post

**DELETE /posts/:id/tags/:tagId** - Eliminar tag de un post

### Post Comments

**GET /posts/:id/comments** - Obtener comentarios de un post (filtrados por antigüedad)

### Comments

**GET /comments** - Obtener todos los comentarios

**GET /comments/:id** - Obtener un comentario por ID

**POST /comments** - Crear un comentario
```json
{
  "content": "Gran post!",
  "userId": "6856ea88be5012c571952977",
  "postId": "6856ea88be5012c571952985"
}
```

**PUT /comments/:id** - Actualizar un comentario
```json
{
  "content": "Excelente post actualizado!"
}
```

**DELETE /comments/:id** - Eliminar un comentario

### Tags

**GET /tags** - Obtener todos los tags

**GET /tags/:id** - Obtener un tag por ID

**POST /tags** - Crear un tag
```json
{
  "name": "tecnología"
}
```

**PUT /tags/:id** - Actualizar un tag
```json
{
  "name": "tecnología-actualizada"
}
```

**DELETE /tags/:id** - Eliminar un tag (solo desasocia de posts)

## 📚 Documentación Interactiva (Swagger)

La documentación interactiva de la API está disponible a través de Swagger UI.

### Para acceder:

1. Asegúrate de que el servidor esté corriendo:
   ```bash
   npm start
   ```

2. Accede a la documentación en tu navegador:
   ```
   http://localhost:3000/api-docs/
   ```

### Características de la documentación:

- Todos los endpoints documentados
- Schemas detallados para cada entidad
- Ejemplos de requests y responses
- Códigos de estado HTTP apropiados
- Validaciones y patrones especificados
- Interfaz interactiva para probar endpoints

## Colecciones de Prueba (Postman)

El proyecto incluye colecciones de Postman para facilitar las pruebas:

### Archivos incluidos:
- `postman/anti-social-network.postman_collection.json` - Colección con todos los endpoints
- `postman/anti-social-network.postman_environment.json` - Variables de entorno

### Para usar las colecciones:

1. **Importar en Postman:**
   - Colección: `anti-social-network.postman_collection.json`
   - Environment: `anti-social-network.postman_environment.json`

2. **Ejecutar seeders:**
   ```bash
   npm run seed
   ```

3. **Obtener IDs reales** de las respuestas de la API y actualizar las variables del environment

## Optimización con Redis

El sistema implementa caché con Redis para optimizar las consultas. El tiempo de vida (TTL) de la caché depende del tipo de dato:

### TTL por tipo de dato:
- **Users:** 30 minutos (cambian poco)
- **Tags:** 30 minutos (cambian poco)
- **Post Images:** 30 minutos (URLs estáticas)
- **Posts:** 10 minutos (cambian moderadamente)
- **Comments:** 2 minutos (cambian frecuentemente)

### Características de implementación:

- **Hard delete** con cascada apropiada
- **Validaciones** con Joi schemas
- **Middlewares** genéricos para validaciones comunes
- **Filtrado automático** de comentarios antiguos
- **Caché con Redis** para optimizar consultas
- **Relaciones pobladas** automáticamente en posts
- **Manejo de errores** consistente
- **Variables de entorno** configurables

## Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Redis** - Caché en memoria
- **Joi** - Validación de datos
- **Swagger** - Documentación de API
- **Docker** - Contenedores para servicios

## Bonus: Funcionalidades Adicionales

### ¿Cómo modelar que un usuario pueda "seguir" a otros usuarios y ser seguido por muchos? (Followers)

Para implementar la funcionalidad de seguidores en MongoDB, podríamos agregar campos de referencia en el modelo de usuario:

- **followers:** Array de ObjectId de usuarios que siguen a este usuario.
- **following:** Array de ObjectId de usuarios a los que este usuario sigue.

Ejemplo de esquema:

```js
const userSchema = new mongoose.Schema({
  nickName: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
```

Esto permite:
- Consultar fácilmente los seguidores y seguidos de un usuario.
- Implementar endpoints como `/users/:id/followers` y `/users/:id/following`.
- Agregar o sacar seguidores de manera eficiente usando operadores de MongoDB (`$addToSet`, `$pull`).

### ¿Qué estrategias podrían utilizar para que la información de los posts no sea constantemente consultada desde la base de datos?

Para optimizar las consultas a posts que no varían frecuentemente, podemos implementar una estrategia de caché usando Redis.

Esta implementación ofrece:

- Reducción significativa de consultas a la base de datos
- Mejor tiempo de respuesta para lecturas frecuentes
- Menor carga en la base de datos

Consideración adicional:

- Configurar un TTL (Time To Live) apropiado según el caso de uso. Por ejemplo, el TTL de los comments debería ser más corto que el de la información del usuario, ya que los comentarios cambian mucho más seguido.

