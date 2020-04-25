const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString
} = require('graphql')

const {
    UserType,
    PostType,
    AuthType,
    ChatRoom,
} = require('./schemas')

const UsersController = require('../controllers/Users')
const PostsController = require('../controllers/Posts')
const ChatController = require('../controllers/Chat')

exports.User = {
    type: UserType,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: (_, { id }) => UsersController.FindUserById(id)
}

exports.UserSigninWithToken = {
    type: AuthType,
    resolve: (_, __, { bearerId }) => UsersController.SignInWithToken(bearerId)
}

exports.UserSignin = {
    type: AuthType,
    args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args) => UsersController.UserSignIn(args)
}

exports.Users = {
    type: new GraphQLList(UserType),
    args: {
        from: { type: GraphQLID },
        limit: { type: GraphQLInt },
    },
    resolve: (_, { from, limit = 10 }) => {
        if (from)
            return UsersController.FindUsersWithPaging(from, limit)
        else
            return UsersController.FindUsers()
    }
}

exports.Post = {
    type: PostType,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: (_, { id }) => PostsController.FindPostById(id)
}

exports.Posts = {
    type: new GraphQLList(PostType),
    args: {
        from: { type: GraphQLID },
        limit: { type: GraphQLInt },
    },
    resolve: (_, { from, limit = 10 }) => {
        if (from)
            return PostsController.FindPostsWithPaging(from, limit)
        else
            return PostsController.FindPosts()
    }
}

exports.Chats = {
    type: new GraphQLList(ChatRoom),
    args: {
        from: { type: GraphQLID },
        limit: { type: GraphQLInt },
    },
    resolve: (_, { from, limit = 10 }, { bearerId }) => {
        if (from)
            return ChatController.FindChatsWithPaging(bearerId, from, limit)
        else
            return ChatController.FindChats(bearerId)
    }
}