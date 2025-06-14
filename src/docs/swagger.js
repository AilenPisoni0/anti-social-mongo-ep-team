const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Anti-Social Network API',
            version: '1.0.0',
            description: 'API REST para una red social antisocial',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Servidor de desarrollo',
            },
        ],
    },
    apis: ['./src/docs/routes/*.swagger.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi }; 