'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('tags', [
            {
                name: 'tecnologia',
                isEdited: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'lifestyle',
                isEdited: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'viajes',
                isEdited: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('tags', null, {});
    }
}; 