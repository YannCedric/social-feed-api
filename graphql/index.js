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
    SignUp,
    UpdateProfile,
    CreatePost,
    UpdatePost,
    DeletePost,
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
    EditChatRoom,
    DeleteChatRoom,
} = require('./mutations')

const {
    ChatStream,
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
            SignUp,
            UpdateProfile,
            CreatePost,
            UpdatePost,
            DeletePost,
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
            EditChatRoom,
            DeleteChatRoom,
        },
    }),
    subscription: new GraphQLObjectType({
        name: 'RootSub',
        fields: {
            ChatStream,
        }
    }),
})

module.exports = {schema}