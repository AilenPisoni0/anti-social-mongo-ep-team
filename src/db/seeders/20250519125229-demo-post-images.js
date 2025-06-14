'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const posts = await queryInterface.sequelize.query('SELECT id from posts;');
        const postRows = posts[0];

        await queryInterface.bulkInsert('post_images', [
            {
                url: 'https://ejemplo.com/imagen1.jpg',
                postId: postRows[0].id,
                isEdited: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                url: 'https://ejemplo.com/imagen2.jpg',
                postId: postRows[1].id,
                isEdited: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('post_images', null, {});
    }
}; 