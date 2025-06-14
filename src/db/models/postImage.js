'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PostImage.belongsTo(models.Post, {
        foreignKey: 'postId'
      });
    }
  }
  PostImage.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    postId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PostImage',
    tableName: 'post_images',
    timestamps: true,
    paranoid: true,
  });
  return PostImage;
};