'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const posts = await queryInterface.sequelize.query('SELECT id from posts;');
        const tags = await queryInterface.sequelize.query('SELECT id from tags;');
        const postRows = posts[0];
        const tagRows = tags[0];

        await queryInterface.bulkInsert('post_tags', [
            {
                postId: postRows[0].id,
                tagId: tagRows[0].id,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postId: postRows[0].id,
                tagId: tagRows[1].id,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('post_tags', null, {});
    }
}; 