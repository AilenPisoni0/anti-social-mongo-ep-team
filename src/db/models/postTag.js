'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PostTag extends Model {
        static associate(models) {
        }
    }

    PostTag.init({
        postId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Post',
                key: 'id'
            }
        },
        tagId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Tag',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'PostTag',
        tableName: 'post_tags',
        timestamps: true,
        paranoid: false
    });

    return PostTag;
}; 