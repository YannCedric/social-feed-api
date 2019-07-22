const {
    GraphQLString,
    GraphQLID,
    GraphQLNonNull,
} = require('graphql')

const {
    UserType
} = require('./schemas')

const UsersController = require('../controllers/Users')


const CreateUser = {
    type: UserType,
    args: { 
        fullname: {type: GraphQLString},
        email: {type: GraphQLString},
        username: {type: GraphQLString},
        picture: {type: GraphQLString},
        bio: {type: GraphQLString}, 
    },
    resolve: (_, args) => UsersController.CreateUser(args)
}

const UpdateUser = {
    type: UserType,
    args: { 
        id: {type: new GraphQLNonNull(GraphQLID)},
        fullname: {type: GraphQLString},
        email: {type: GraphQLString},
        username: {type: GraphQLString},
        picture: {type: GraphQLString},
        bio: {type: GraphQLString}, 
    },
    resolve: (_, args) => UsersController.UpdateUser(args)
}

module.exports = {
    CreateUser,
    UpdateUser,
}