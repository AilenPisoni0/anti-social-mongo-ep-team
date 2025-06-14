/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtener todos los posts
 *     tags: [Posts]
 *   post:
 *     summary: Crear un nuevo post
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
 *                 example: "Mi primer post en la red antisocial!"
 *               userId:
 *                 type: integer
 *                 example: 2
 * 
 * /posts/{id}:
 *   get:
 *     summary: Obtener un post por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *   put:
 *     summary: Actualizar un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Post actualizadito"
 *   delete:
 *     summary: Eliminar un post (soft delete)
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 * 
 * /posts/{id}/images:
 *   get:
 *     summary: Obtener imágenes de un post
 *     tags: [Post Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *   post:
 *     summary: Agregar imagen a un post
 *     tags: [Post Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 * 
 * /posts/{id}/images/{imageId}:
 *   delete:
 *     summary: Eliminar imagen de un post
 *     tags: [Post Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 * 
 * /posts/{id}/tags:
 *   get:
 *     summary: Obtener tags de un post
 *     tags: [Post Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 * 
 * /posts/{id}/tags/{tagId}:
 *   post:
 *     summary: Agregar tag a un post
 *     tags: [Post Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *   delete:
 *     summary: Eliminar tag de un post
 *     tags: [Post Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 * 
 * /posts/{id}/comments:
 *   get:
 *     summary: Obtener comentarios de un post
 *     tags: [Post Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */ 