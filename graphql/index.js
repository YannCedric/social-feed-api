const {
    GraphQLSchema,
    GraphQLObjectType,
} = require('graphql')

const {
    User,
    Users,
    Post,
    Posts,
    Login,
    LoginWithToken,
    Chats,
} = require('./queries')

const {
    CreateUser,
    UpdateProfile,
    CreatePost,
    UpdatePost,
    MakeComment,
    EditComment,
    LikePost,
    DislikePost,
    LikeComment,
    DisLikeComment,
    DeleteComment,
    SendDirectMessage,
    SendRoomMessage,
    CreateChatRoom,
} = require('./mutations')

const {
    UsersSub,
} = require('./subscriptions')

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: {
            User,
            Users,
            Post,
            Posts,
            Login,
            LoginWithToken,
            Chats,
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'RootMutation',
        fields: {
            CreateUser,
            UpdateProfile,
            CreatePost,
            UpdatePost,
            MakeComment,
            EditComment,
            LikePost,
            DislikePost,
            LikeComment,
            DisLikeComment,
            DeleteComment,
            SendDirectMessage,
            SendRoomMessage,
            CreateChatRoom,
        },
    }),
    subscription: new GraphQLObjectType({
        name: 'RootSub',
        fields: {
            UsersSub,
        }
    }),
})

module.exports = {schema}