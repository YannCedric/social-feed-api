const {
    GraphQLString,
    GraphQLID,
    GraphQLNonNull,
    GraphQLList,
} = require('graphql')

const {
    UserType,
    PostType,
} = require('./schemas')

const UsersController = require('../controllers/Users')
const PostsController = require('../controllers/Posts')

const CreateUser = {
    type: UserType,
    args: { 
        fullname: {type: GraphQLString},
        email: {type: GraphQLString},
        username: {type: GraphQLString},
        picture: {type: GraphQLString},
        bio: {type: GraphQLString}, 
    },
    resolve: (_, args) => UsersController.CreateUser(args)
}

const UpdateUser = {
    type: UserType,
    args: { 
        id: {type: new GraphQLNonNull(GraphQLID)},
        fullname: {type: GraphQLString},
        email: {type: GraphQLString},
        username: {type: GraphQLString},
        picture: {type: GraphQLString},
        bio: {type: GraphQLString}, 
    },
    resolve: (_, args) => UsersController.UpdateUser(args)
}

const CreatePost = { // Protected Route
    type: PostType,
    args: {
        text: {type: GraphQLString},
        picture: {type: GraphQLString},
        tags: {type: new GraphQLList(GraphQLString)},
    },
    resolve: (_, args, context) => PostsController.CreatePost({...args, authorId: context.headers.bearerID})
}

const UpdatePost = {
    type: PostType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: GraphQLString},
        picture: {type: GraphQLString},
        tags: {type: new GraphQLList(GraphQLString)},
    },
    resolve: (_, args) => PostsController.UpdatePost(args)
}

module.exports = {
    CreateUser,
    UpdateUser,
    CreatePost,
    UpdatePost,
}