'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('users', [
            {
                nickName: 'john_doe',
                email: 'john@example.com',
                isEdited: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                nickName: 'jane_smith',
                email: 'jane@example.com',
                isEdited: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
    }
}; 