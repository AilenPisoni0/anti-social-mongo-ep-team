const validateUpdateFields = () => {
   return (req, res, next) => {
      const allowedFields = ['content', 'createdAt'];  // ahora permitimos actualizar también la fecha
      const receivedFields = Object.keys(req.body);

      const hasInvalidFields = receivedFields.some(field => !allowedFields.includes(field));

      if (hasInvalidFields) {
         return res.status(400).json({
            message: 'Solo se puede actualizar el contenido o la fecha del comentario'
         });
      }
      next();
   }
}

module.exports = {
  validateUpdateFields,
};


module.exports = { validateUpdateFields }