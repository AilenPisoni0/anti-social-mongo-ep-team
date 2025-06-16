const { UserSchema, UpdateUserSchema  } = require("./userSchema");
const { TagSchema, UpdateTagSchema  } = require("./tagSchema");
//const { PostTagSchema } = require("./postTagSchema");
const { createPostSchema, updatePostSchema } = require("./postSchema");
const {CommentSchema, CommentUpdateSchema}= require("./commentSchema");
const { createPostImageSchema, updatePostImageSchema } = require("./postImageSchemas"); 

module.exports={
    UserSchema,
    UpdateUserSchema, //exportar updateUserschema
    TagSchema,
    UpdateTagSchema, //exportar updateTagSc
    //PostTagSchema,
    createPostSchema,
    updatePostSchema,
    CommentSchema,
    CommentUpdateSchema, //exportar CommentUpdateS
    createPostImageSchema,
    updatePostImageSchema,
};
