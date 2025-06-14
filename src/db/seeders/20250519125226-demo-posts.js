'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            'SELECT id from users;'
        );
        const userRows = users[0];

        await queryInterface.bulkInsert('posts', [
            {
                description: 'Este es mi primer post en la red social',
                userId: userRows[0].id,
                isEdited: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                description: 'Compartiendo mis pensamientos en esta nueva plataforma',
                userId: userRows[1].id,
                isEdited: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('posts', null, {});
    }
}; 