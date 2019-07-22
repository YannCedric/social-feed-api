const {
    GraphQLSchema,
    GraphQLObjectType,
} = require('graphql')

const {
    User,
    Users,
    Post,
    Posts,
} = require('./queries')

const {
    CreateUser,
    UpdateUser,
    CreatePost,
    UpdatePost,
} = require('./mutations')

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: {
            User,
            Users,
            Post,
            Posts,
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'RootMutation',
        fields: {
            CreateUser,
            UpdateUser,
            CreatePost,
            UpdatePost,
        }
    })
})

module.exports = {schema}