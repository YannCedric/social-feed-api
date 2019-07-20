const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
} = require('graphql')

const {
    UserType
} = require('./schemas')

const UsersController = require('../controllers/Users')


const User = {
    type: UserType,
    args: { id: {type: new GraphQLNonNull(GraphQLID)} },
    resolve: (_, {id}) => UsersController.FindUserById(id)
}

// TODO: Implement args search
const Users = {
    type: new GraphQLList(UserType),
    resolve: _ => UsersController.FindUsers()
}

module.exports = {
    User,
    Users,
}