/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6856ea88be5012c571952987"
 *         content:
 *           type: string
 *           example: "Excelente post! Me encanta la tecnologia"
 *         userId:
 *           type: string
 *           example: "6856ea88be5012c571952977"
 *         postId:
 *           type: string
 *           example: "6856ea88be5012c571952985"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         user:
 *           $ref: '#/components/schemas/User'
 *         post:
 *           $ref: '#/components/schemas/Post'
 * 
 * /comments:
 *   get:
 *     summary: Obtener todos los comentarios
 *     description: Retorna una lista de todos los comentarios con usuarios y posts populados
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida exitosamente
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
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No se pudieron obtener los comentarios"
 *   post:
 *     summary: Crear un nuevo comentario
 *     description: Crea un nuevo comentario asociado a un usuario y post existentes
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
 *                 minLength: 1
 *                 maxLength: 1000
 *                 example: "Excelente post! Me encanta la tecnologia"
 *                 description: Contenido del comentario
 *               userId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 example: "6856ea88be5012c571952977"
 *                 description: ID del usuario que crea el comentario
 *               postId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 example: "6856ea88be5012c571952985"
 *                 description: ID del post al que pertenece el comentario
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comentario creado exitosamente"
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario o post no encontrado
 *       500:
 *         description: Error interno del servidor
 * 
 * /comments/{id}:
 *   get:
 *     summary: Obtener un comentario por ID
 *     description: Retorna un comentario específico con usuario y post populados
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c571952987"
 *         description: ID del comentario (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Comentario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comentario obtenido exitosamente"
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comentario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Comentario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *   put:
 *     summary: Actualizar un comentario
 *     description: Actualiza el contenido de un comentario existente
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c571952987"
 *         description: ID del comentario (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 example: "Excelente post actualizado! Me encanta mucho la tecnologia"
 *                 description: Nuevo contenido del comentario
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comentario actualizado exitosamente"
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error interno del servidor
 *   delete:
 *     summary: Eliminar un comentario
 *     description: Elimina un comentario específico
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c571952987"
 *         description: ID del comentario (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Comentario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comentario eliminado exitosamente"
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error interno del servidor
 */ 