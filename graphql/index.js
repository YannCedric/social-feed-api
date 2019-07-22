const {
    GraphQLSchema,
    GraphQLObjectType,
} = require('graphql')

const {
    User,
    Users,
} = require('./queries')

const {
    CreateUser,
    UpdateUser,
} = require('./mutations')

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: {
            User,
            Users,
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'RootMutation',
        fields: {
            CreateUser,
            UpdateUser,
        }
    })
})

module.exports = {schema}