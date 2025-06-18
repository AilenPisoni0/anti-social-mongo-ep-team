const { UserSchema, UpdateUserSchema  } = require("./userSchema");
const { TagSchema, UpdateTagSchema  } = require("./tagSchema");
//const { PostTagSchema } = require("./postTagSchema");
const { createPostSchema, updatePostSchema } = require("./postSchema");
const {CommentSchema, CommentUpdateSchema}= require("./commentSchema");
const { createPostImageSchema, updatePostImageSchema } = require("./postImageSchemas"); 

module.exports={
    UserSchema,
    UpdateUserSchema, //exporta updateUserschema
    TagSchema,
    UpdateTagSchema, //exporta updateTagSc
    //PostTagSchema,
    createPostSchema,
    updatePostSchema,
    CommentSchema,
    CommentUpdateSchema, //exporta CommentUpdateS
    createPostImageSchema,
    updatePostImageSchema,
};
