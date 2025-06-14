/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Obtener todos los comentarios
 *     tags: [Comments]
 *   post:
 *     summary: Crear un nuevo comentario
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - userId
 *               - postId
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Gran post!"
 *               userId:
 *                 type: integer
 *                 example: 2
 *               postId:
 *                 type: integer
 *                 example: 2
 * 
 * /comments/{id}:
 *   get:
 *     summary: Obtener un comentario por ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *   put:
 *     summary: Actualizar un comentario
 *     tags: [Comments]
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
 *               content:
 *                 type: string
 *                 example: "eeexcelente post!"
 *   delete:
 *     summary: Eliminar un comentario (soft delete)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */ 