const { UserSchema } = require("./userSchema");
const { TagSchema } = require("./tagSchema");
const { PostTagSchema } = require("./postTagSchema");
const { createPostSchema, updatePostSchema } = require("./postSchema");
const {CommentSchema}= require("./commentSchema")
module.exports={
    UserSchema,
    TagSchema,
    PostTagSchema,
    createPostSchema,
    updatePostSchema,
    CommentSchema,
};
