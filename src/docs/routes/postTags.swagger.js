/**
 * @swagger
 * /post-tags/posts/{postId}/tags:
 *   get:
 *     summary: Obtener tags de un post
 *     description: Retorna todos los tags asociados a un post específico
 *     tags: [Post Tags]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c571952985"
 *         description: ID del post (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Tags del post obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tags del post obtenidos exitosamente"
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Post no encontrado
 *       500:
 *         description: Error interno del servidor
 * 
 * /post-tags/posts/{postId}/tags/{tagId}:
 *   post:
 *     summary: Asociar tag a un post
 *     description: Asocia un tag específico a un post
 *     tags: [Post Tags]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c571952985"
 *         description: ID del post (ObjectId de MongoDB)
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c57195297d"
 *         description: ID del tag (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Tag asociado exitosamente al post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag asociado exitosamente al post"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: El tag ya está asociado al post
 *       404:
 *         description: Post o tag no encontrado
 *       500:
 *         description: Error interno del servidor
 *   delete:
 *     summary: Remover tag de un post
 *     description: Remueve un tag específico de un post
 *     tags: [Post Tags]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c571952985"
 *         description: ID del post (ObjectId de MongoDB)
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c57195297d"
 *         description: ID del tag (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Tag removido exitosamente del post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag removido exitosamente del post"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post o tag no encontrado
 *       500:
 *         description: Error interno del servidor
 * 
 * /post-tags/tags/{tagId}/posts:
 *   get:
 *     summary: Obtener posts por tag
 *     description: Retorna todos los posts que tienen un tag específico
 *     tags: [Post Tags]
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         example: "6856ea88be5012c57195297d"
 *         description: ID del tag (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Posts del tag obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Posts del tag obtenidos exitosamente"
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       404:
 *         description: Tag no encontrado
 *       500:
 *         description: Error interno del servidor
 */ 