const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString
} = require('graphql')

const {
    UserType,
    PostType,
    AuthType,
} = require('./schemas')

const UsersController = require('../controllers/Users')
const PostsController = require('../controllers/Posts')


const User = {
    type: UserType,
    args: { id: {type: new GraphQLNonNull(GraphQLID)} },
    resolve: (_, {id}) => UsersController.FindUserById(id)
}

const LoginWithToken = {
    type: AuthType,
    resolve: (_, __, {bearerId}) => UsersController.IssueNewUserToken(bearerId)
}

const Login = {
    type: AuthType,
    args: { 
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: async (_, args) =>  UsersController.LoginUser(args)
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

const Post = {
    type: PostType,
    args: { id: {type: new GraphQLNonNull(GraphQLID)} },
    resolve: (_, {id}) =>PostsController.FindPostById(id)
}

const Posts = {
    type: new GraphQLList(PostType),
    args: { 
        from: {type: GraphQLID}, 
        limit: {type: GraphQLInt},
    },
    resolve: (_, {from, limit=10}) => {
        if (from)
            return PostsController.FindPostsWithPaging(from, limit)
        else
            return PostsController.FindPosts()
    }
}

module.exports = {
    User,
    Users,
    Login,
    LoginWithToken,
    
    Post,
    Posts,
}