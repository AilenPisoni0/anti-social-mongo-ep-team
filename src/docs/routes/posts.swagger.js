/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6856ea88be5012c571952985"
 *         description:
 *           type: string
 *           example: "Este es mi primer post en la red social!"
 *         userId:
 *           type: string
 *           example: "6856ea88be5012c571952977"
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PostImage'
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PostImage:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6856ea88be5012c57195298a"
 *         postId:
 *           type: string
 *           example: "6856ea88be5012c571952985"
 *         url:
 *           type: string
 *           example: "/uploads/images/tecnologia-placeholder.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 * /posts:
 *   get:
 *     summary: Obtener todos los posts
 *     description: Retorna una lista de todos los posts con usuarios, tags, imágenes y comentarios populados
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Posts obtenidos exitosamente"
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No se pudieron obtener los posts"
 *   post:
 *     summary: Crear un nuevo post
 *     description: Crea un nuevo post asociado a un usuario existente
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - userId
 *             properties:
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *                 example: "Mi primer post en la red antisocial!"
 *                 description: Contenido del post
 *               userId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 example: "6856ea88be5012c571952977"
 *                 description: ID del usuario que crea el post
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   pattern: '^[0-9a-fA-F]{24}$'
 *                 example: ["6856ea88be5012c57195297d", "6856ea88be5012c571952980"]
 *                 description: Array de IDs de tags para asociar al post
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 maxItems: 5
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *                 description: Array de URLs de imágenes (máximo 5)
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
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 * 
 * /posts/{id}:
 *   get:
 *     summary: Obtener un post por ID
 *     description: Retorna un post específico con todas sus relaciones populadas
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c571952985"
 *         description: ID del post (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Post obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post obtenido exitosamente"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno del servidor
 *   put:
 *     summary: Actualizar un post
 *     description: Actualiza un post existente, incluyendo la posibilidad de cambiar el usuario
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c571952985"
 *         description: ID del post (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *                 example: "Post actualizado con nuevo contenido"
 *                 description: Nuevo contenido del post
 *               userId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 example: "6856ea88be5012c571952978"
 *                 description: Nuevo ID del usuario propietario del post
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   pattern: '^[0-9a-fA-F]{24}$'
 *                 example: ["6856ea88be5012c57195297d"]
 *                 description: Nuevo array de IDs de tags
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 maxItems: 5
 *                 example: ["https://example.com/new-image.jpg"]
 *                 description: Nuevo array de URLs de imágenes
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
 *         description: Datos inválidos
 *       404:
 *         description: Post o usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *   delete:
 *     summary: Eliminar un post
 *     description: Elimina un post y todos sus comentarios e imágenes (cascada)
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c571952985"
 *         description: ID del post (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Post eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post eliminado exitosamente junto con todos sus recursos asociados"
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
 *         example: "6856ea88be5012c571952985"
 *         description: ID del post (ObjectId de MongoDB)
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
 *   post:
 *     summary: Agregar imagen a un post
 *     description: Sube una nueva imagen y la asocia a un post
 *     tags: [Post Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c571952985"
 *         description: ID del post (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - imagen
 *             properties:
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen (JPG, PNG, GIF, máximo 5MB)
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
 *                   example: "Imagen agregada exitosamente al post"
 *                 image:
 *                   $ref: '#/components/schemas/PostImage'
 *       400:
 *         description: Archivo inválido o no proporcionado
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno del servidor
 *   put:
 *     summary: Actualizar imágenes de un post
 *     description: Reemplaza todas las imágenes de un post con nuevas URLs
 *     tags: [Post Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c571952985"
 *         description: ID del post (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imagenes
 *             properties:
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 maxItems: 5
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *                 description: Array de URLs de imágenes
 *     responses:
 *       200:
 *         description: Imágenes actualizadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Imágenes del post actualizadas exitosamente"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno del servidor
 * 
 * /posts/{id}/images/{imageId}:
 *   put:
 *     summary: Actualizar imagen específica de un post
 *     description: Reemplaza una imagen específica de un post
 *     tags: [Post Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c571952985"
 *         description: ID del post (ObjectId de MongoDB)
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c57195298a"
 *         description: ID de la imagen (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - imagen
 *             properties:
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Nuevo archivo de imagen
 *     responses:
 *       200:
 *         description: Imagen actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Imagen actualizada exitosamente"
 *                 image:
 *                   $ref: '#/components/schemas/PostImage'
 *       400:
 *         description: Archivo inválido
 *       404:
 *         description: Post o imagen no encontrada
 *       500:
 *         description: Error interno del servidor
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
 *         example: "6856ea88be5012c571952985"
 *         description: ID del post (ObjectId de MongoDB)
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c57195298a"
 *         description: ID de la imagen (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Imagen eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Imagen eliminada exitosamente"
 *       404:
 *         description: Post o imagen no encontrada
 *       500:
 *         description: Error interno del servidor
 * 
 * /posts/{id}/comments:
 *   get:
 *     summary: Obtener comentarios de un post
 *     description: Retorna todos los comentarios de un post específico
 *     tags: [Post Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c571952985"
 *         description: ID del post (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Comentarios obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comentarios obtenidos exitosamente"
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno del servidor
 */ 