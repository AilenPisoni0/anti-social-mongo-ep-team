const { UserSchema, UpdateUserSchema } = require("./userSchema");
const { TagSchema, UpdateTagSchema } = require("./tagSchema");
const { createPostSchema, updatePostSchema } = require("./postSchema");
const { CommentSchema, CommentUpdateSchema } = require("./commentSchema");
const { createPostImageSchema, updatePostImageSchema } = require("./postImageSchemas");

module.exports = {
    UserSchema,
    UpdateUserSchema,
    TagSchema,
    UpdateTagSchema,
    createPostSchema,
    updatePostSchema,
    CommentSchema,
    CommentUpdateSchema,
    createPostImageSchema,
    updatePostImageSchema
};
