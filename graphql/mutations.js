const {
    GraphQLString,
    GraphQLID,
    GraphQLNonNull,
    GraphQLList,
} = require('graphql')

const {
    UserType,
    PostType,
    CommentType,
} = require('./schemas')

const UsersController = require('../controllers/Users')
const PostsController = require('../controllers/Posts')

const CreateUser = {
    type: UserType,
    args: { 
        email: {type: new GraphQLNonNull(GraphQLString)},
        username: {type: new GraphQLNonNull(GraphQLString)},
        fullname: {type: GraphQLString},
        picture: {type: GraphQLString},
        bio: {type: GraphQLString}, 
    },
    resolve: async (_, args, context) => {
        const newUser = await UsersController.CreateUser(args)
        if (context.pubsub) context.pubsub.publish('user', {UsersSub: newUser})
        return newUser
    }
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
        text: {type: new GraphQLNonNull(GraphQLString)},
        picture: {type: GraphQLString},
        tags: {type: new GraphQLList(GraphQLString)},
    },
    resolve: (_, args, context) => {
        return PostsController.CreatePost({...args, authorId: context.headers.bearerid})
    }
}

const UpdatePost = { // Protected Route
    type: PostType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: GraphQLString},
        picture: {type: GraphQLString},
        tags: {type: new GraphQLList(GraphQLString)},
    },
    resolve: (_, args) => PostsController.UpdatePost(args)
}

const MakeComment = { // Protected Route
    type: CommentType,
    args: {
        postId: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: new GraphQLNonNull(GraphQLString)},
        picture: {type: GraphQLString},
    },
    resolve: (_, args, context) => PostsController.MakeComment({...args, authorId: context.headers.bearerid})
}

const EditComment = { // Protected Route
    type: CommentType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: GraphQLString},
        picture: {type: GraphQLString},
    },
    resolve: (_, args, context) => PostsController.UpdateComment(args)
}

module.exports = {
    CreateUser,
    UpdateUser,
    CreatePost,
    UpdatePost,
    MakeComment,
    EditComment,
}