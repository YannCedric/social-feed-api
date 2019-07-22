const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLInt,
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
    args: { 
        from: {type: GraphQLID}, 
        limit: {type: GraphQLInt},
    },
    resolve: (_, {from, limit=10}) => {
        if (from)
            return UsersController.FindUsersWithPaging(from, limit)
        else
            return UsersController.FindUsers()
    }
}

module.exports = {
    User,
    Users,
}