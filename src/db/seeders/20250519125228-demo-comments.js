'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query('SELECT id from users;');
        const posts = await queryInterface.sequelize.query('SELECT id from posts;');
        const userRows = users[0];
        const postRows = posts[0];

        await queryInterface.bulkInsert('comments', [
            {
                content: '¡Excelente publicación!',
                userId: userRows[0].id,
                postId: postRows[0].id,
                isEdited: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                content: 'Muy interesante tu punto de vista',
                userId: userRows[1].id,
                postId: postRows[0].id,
                isEdited: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('comments', null, {});
    }
}; 