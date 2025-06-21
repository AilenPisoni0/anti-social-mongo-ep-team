/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - description
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del post
 *           example: "507f1f77bcf86cd799439011"
 *         description:
 *           type: string
 *           description: Descripción del post
 *           example: "Este es un post de ejemplo"
 *         userId:
 *           type: string
 *           description: ID del usuario que creó el post
 *           example: "507f1f77bcf86cd799439012"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de IDs de tags asociados al post
 *           example: ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"]
 *         imagenes:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de URLs de imágenes para el post
 *           example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del post
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del post
 *         populatedTags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *           description: Tags poblados del post
 *         postImages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PostImage'
 *           description: Imágenes pobladas del post
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: Comentarios poblados del post
 *     
 *     PostImage:
 *       type: object
 *       required:
 *         - postId
 *         - url
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la imagen
 *           example: "507f1f77bcf86cd799439015"
 *         postId:
 *           type: string
 *           description: ID del post al que pertenece la imagen
 *           example: "507f1f77bcf86cd799439011"
 *         url:
 *           type: string
 *           description: URL de la imagen
 *           example: "https://example.com/image.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la imagen
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización de la imagen
 *     
 *     CreatePostRequest:
 *       type: object
 *       required:
 *         - description
 *         - userId
 *       properties:
 *         description:
 *           type: string
 *           description: Descripción del post
 *           example: "Este es un post de ejemplo"
 *         userId:
 *           type: string
 *           description: ID del usuario que crea el post
 *           example: "507f1f77bcf86cd799439012"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de IDs de tags para asociar al post
 *           example: ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"]
 *         imagenes:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de URLs de imágenes para el post
 *           example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *     
 *     UpdatePostRequest:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *           description: Nueva descripción del post
 *           example: "Descripción actualizada del post"
 *         userId:
 *           type: string
 *           description: Nuevo ID del usuario propietario del post
 *           example: "507f1f77bcf86cd799439012"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Nuevo array de IDs de tags para el post
 *           example: ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"]
 *         imagenes:
 *           type: array
 *           items:
 *             type: string
 *           description: Nuevo array de URLs de imágenes para el post
 *           example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *     
 *     CreatePostImageRequest:
 *       type: object
 *       required:
 *         - url
 *       properties:
 *         url:
 *           type: string
 *           description: URL de la imagen
 *           example: "https://example.com/image.jpg"
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtener todos los posts
 *     description: Retorna una lista de todos los posts con sus relaciones pobladas
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       204:
 *         description: No hay posts para mostrar
 *       500:
 *         description: Error interno del servidor
 *   
 *   post:
 *     summary: Crear un nuevo post
 *     description: Crea un nuevo post con descripción, usuario y opcionalmente tags e imágenes
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       201:
 *         description: Post creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post creado exitosamente"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 * 
 * /posts/{id}:
 *   get:
 *     summary: Obtener un post por ID
 *     description: Retorna un post específico con todas sus relaciones pobladas
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del post
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Post obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno del servidor
 *   
 *   put:
 *     summary: Actualizar un post
 *     description: Actualiza un post existente con nuevos datos
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del post
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostRequest'
 *     responses:
 *       200:
 *         description: Post actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post actualizado exitosamente"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Post o usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *   
 *   delete:
 *     summary: Eliminar un post
 *     description: Elimina un post y todos sus comentarios e imágenes asociados (cascada)
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del post
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       204:
 *         description: Post eliminado exitosamente
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno del servidor
 * 
 * /posts/{id}/images:
 *   get:
 *     summary: Obtener imágenes de un post
 *     description: Retorna todas las imágenes asociadas a un post específico
 *     tags: [Post Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del post
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Imágenes obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostImage'
 *       204:
 *         description: No hay imágenes para este post
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno del servidor
 *   
 *   post:
 *     summary: Agregar imagen a un post
 *     description: Agrega una nueva imagen a un post específico
 *     tags: [Post Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del post
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostImageRequest'
 *     responses:
 *       201:
 *         description: Imagen agregada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Imagen del post creada exitosamente"
 *                 image:
 *                   $ref: '#/components/schemas/PostImage'
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno del servidor
 * 
 * /posts/{id}/images/{imageId}:
 *   delete:
 *     summary: Eliminar imagen de un post
 *     description: Elimina una imagen específica de un post
 *     tags: [Post Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del post
 *         example: "507f1f77bcf86cd799439011"
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID de la imagen
 *         example: "507f1f77bcf86cd799439015"
 *     responses:
 *       204:
 *         description: Imagen eliminada exitosamente
 *       404:
 *         description: Post o imagen no encontrada
 *       500:
 *         description: Error interno del servidor
 * 
 * /posts/{id}/comments:
 *   get:
 *     summary: Obtener comentarios de un post
 *     description: Retorna todos los comentarios de un post específico
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del post
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Comentarios obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       204:
 *         description: No hay comentarios para este post
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno del servidor
 * 
 * /posts/{id}/tags:
 *   get:
 *     summary: Obtener tags de un post
 *     description: Retorna todos los tags asociados a un post específico
 *     tags: [Post Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del post
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Tags obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       204:
 *         description: No hay tags para este post
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno del servidor
 * 
 * /posts/{id}/tags/{tagId}:
 *   post:
 *     summary: Agregar tag a un post
 *     description: Asocia un tag específico a un post
 *     tags: [Post Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del post
 *         example: "507f1f77bcf86cd799439011"
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del tag
 *         example: "507f1f77bcf86cd799439013"
 *     responses:
 *       200:
 *         description: Tag agregado al post exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag agregado al post exitosamente"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: El post ya tiene este tag asociado
 *       404:
 *         description: Post o tag no encontrado
 *       500:
 *         description: Error interno del servidor
 *   
 *   delete:
 *     summary: Remover tag de un post
 *     description: Desasocia un tag específico de un post
 *     tags: [Post Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del post
 *         example: "507f1f77bcf86cd799439011"
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID del tag
 *         example: "507f1f77bcf86cd799439013"
 *     responses:
 *       200:
 *         description: Tag removido del post exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag removido del post exitosamente"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: El post no tiene este tag asociado
 *       404:
 *         description: Post o tag no encontrado
 *       500:
 *         description: Error interno del servidor
 */ 