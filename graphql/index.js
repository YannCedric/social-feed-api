const {
    GraphQLSchema,
    GraphQLObjectType,
} = require('graphql')

const {
    User,
    Users,
} = require('./queries')

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'root',
        fields: {
            User,
            Users,
        }
    })
})

module.exports = {schema}