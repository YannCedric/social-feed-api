const {
    GraphQLSchema,
    GraphQLObjectType,
} = require('graphql')

const Queries = require('./queries')

const Mutations = require('./mutations')

const {
    ChatStream,
} = require('./subscriptions')

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: Queries
    }),
    mutation: new GraphQLObjectType({
        name: 'RootMutation',
        fields: Mutations,
    }),
    subscription: new GraphQLObjectType({
        name: 'RootSub',
        fields: {
            ChatStream,
        }
    }),
})

module.exports = {schema}