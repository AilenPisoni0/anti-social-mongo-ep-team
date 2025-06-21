/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6856ea88be5012c57195297d"
 *         name:
 *           type: string
 *           example: "tecnologia"
 *         color:
 *           type: string
 *           example: "#FF5733"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         posts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Post'
 * 
 * /tags:
 *   get:
 *     summary: Obtener todos los tags
 *     description: Retorna una lista de todos los tags con sus posts populados
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Lista de tags obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tags obtenidos exitosamente"
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No se pudieron obtener los tags"
 *   post:
 *     summary: Crear un nuevo tag
 *     description: Crea un nuevo tag con nombre único
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: "tecnologia"
 *                 description: Nombre del tag (debe ser único)
 *               color:
 *                 type: string
 *                 pattern: '^#[0-9A-Fa-f]{6}$'
 *                 example: "#FF5733"
 *                 description: Color hexadecimal del tag (opcional)
 *     responses:
 *       201:
 *         description: Tag creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag creado exitosamente"
 *                 tag:
 *                   $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Datos inválidos o tag ya existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El nombre del tag ya existe"
 *       500:
 *         description: Error interno del servidor
 * 
 * /tags/{id}:
 *   get:
 *     summary: Obtener un tag por ID
 *     description: Retorna un tag específico con sus posts populados
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c57195297d"
 *         description: ID del tag (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Tag obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag obtenido exitosamente"
 *                 tag:
 *                   $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Tag no encontrado"
 *       500:
 *         description: Error interno del servidor
 *   put:
 *     summary: Actualizar un tag
 *     description: Actualiza los datos de un tag existente
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c57195297d"
 *         description: ID del tag (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: "tecnologia-actualizada"
 *                 description: Nuevo nombre del tag (debe ser único)
 *               color:
 *                 type: string
 *                 pattern: '^#[0-9A-Fa-f]{6}$'
 *                 example: "#33FF57"
 *                 description: Nuevo color hexadecimal del tag
 *     responses:
 *       200:
 *         description: Tag actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag actualizado exitosamente"
 *                 tag:
 *                   $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Datos inválidos o nombre duplicado
 *       404:
 *         description: Tag no encontrado
 *       500:
 *         description: Error interno del servidor
 *   delete:
 *     summary: Eliminar un tag
 *     description: Elimina un tag (solo se desasocia de los posts, no se eliminan los posts)
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c57195297d"
 *         description: ID del tag (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Tag eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag eliminado exitosamente"
 *       404:
 *         description: Tag no encontrado
 *       500:
 *         description: Error interno del servidor
 */ 