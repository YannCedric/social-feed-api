const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLInt,
} = require('graphql')

const {
    UserType,
    PostType,
} = require('./schemas')

const UsersController = require('../controllers/Users')
const PostsController = require('../controllers/Posts')


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
    
    Post,
    Posts,
}