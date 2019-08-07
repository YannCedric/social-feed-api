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
} = require('./queries')

const {
    CreateUser,
    UpdateProfile,
    CreatePost,
    UpdatePost,
    MakeComment,
    EditComment,
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