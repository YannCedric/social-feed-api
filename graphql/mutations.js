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
    AuthType,
} = require('./schemas')

const UsersController = require('../controllers/Users')
const PostsController = require('../controllers/Posts')

const CreateUser = {
    type: AuthType,
    args: { 
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
        username: {type: GraphQLString},
        fullname: {type: GraphQLString},
        picture: {type: GraphQLString},
        bio: {type: GraphQLString}, 
    },
    resolve: async (_, args, context) => {
        const {User,token} = await UsersController.CreateUser(args)
        if (context.pubsub) context.pubsub.publish('user', {UsersSub: User})
        return {User, token}
    }
}

const UpdateProfile = {
    type: UserType,
    args: { 
        fullname: {type: GraphQLString},
        email: {type: GraphQLString},
        username: {type: GraphQLString},
        picture: {type: GraphQLString},
        bio: {type: GraphQLString}, 
    },
    resolve: (_, args, {bearerId}) => UsersController.UpdateUser({...args, id: bearerId})
}

const CreatePost = { // Protected Route
    type: PostType,
    args: {
        text: {type: new GraphQLNonNull(GraphQLString)},
        picture: {type: GraphQLString},
        tags: {type: new GraphQLList(GraphQLString)},
    },
    resolve: (_, args, {bearerId:authorId}) => PostsController.CreatePost({...args, authorId})
}

const UpdatePost = { // Protected Route
    type: PostType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: GraphQLString},
        picture: {type: GraphQLString},
        tags: {type: new GraphQLList(GraphQLString)},
    },
    resolve: (_, args, {bearerId:authorId}) => PostsController.UpdatePost({...args, authorId})
}

const LikePost = { // Protected Route
    type: PostType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id: postId}, {bearerId:likerId}) => PostsController.LikePost({postId, likerId})
}

const DislikePost = { // Protected Route
    type: PostType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id: postId}, {bearerId:likerId}) => PostsController.DislikePost({postId, likerId})
}

const MakeComment = { // Protected Route
    type: CommentType,
    args: {
        postId: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: new GraphQLNonNull(GraphQLString)},
        picture: {type: GraphQLString},
    },
    resolve: (_, args, context) => PostsController.MakeComment({...args, authorId: context.headers.bearerId})
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
    UpdateProfile,
    CreatePost,
    UpdatePost,
    MakeComment,
    EditComment,
    LikePost,
    DislikePost,
}