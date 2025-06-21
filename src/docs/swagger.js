const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Anti-Social Network API',
            version: '1.0.0',
            description: 'API REST para una red social antisocial con MongoDB, Redis y manejo de imágenes',
            contact: {
                name: 'UnaHur Anti-Social Net',
                url: 'https://github.com/EP-UnaHur-2025C1/anti-social-relational-ep-team'
            }
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Servidor de desarrollo',
            },
        ],
        components: {
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            example: "Mensaje de error"
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/docs/routes/*.swagger.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi }; 