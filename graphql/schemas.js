const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLInt,
} = require('graphql')

const UsersController = require('../controllers/Users')
const PostsController = require('../controllers/Posts')

const AuthType = new GraphQLObjectType({
    name: 'Auth',
    fields: _=> ({
        User: {type: UserType},
        token: {type: GraphQLString},
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: _ => ({
        id: {type: GraphQLID},
        fullname: {type: GraphQLString},
        email: {type: GraphQLString},
        username: {type: GraphQLString},
        picture: {type: GraphQLString},
        bio: {type: GraphQLString},
        followers: {
            type: UserType,
            resolve: async ({followersIds}, _, __) => {
                UsersController.FindAllUsersByIds(followersIds)
            },
        },
        following: {
            type: UserType,
            resolve: async ({followingIds}, _, __) => {
                UsersController.FindAllUsersByIds(followingIds)
            },
        },
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: _ => ({
        id: {type: GraphQLID},
        text: {type: GraphQLString},
        picture: {type: GraphQLString},
        tags: {type: new GraphQLList(GraphQLString)},
        author: {
            type: UserType,
            resolve: ({authorId}, args, context) => UsersController.FindUserById(authorId)
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve: ({commentsIds}, args, context) => PostsController.GetAllCommentsByIds(commentsIds)
        },
        likers: {
            type: new GraphQLList(UserType),
            resolve: ({likersIds}, args, context) => UsersController.FindAllUsersByIds(likersIds)
        },
        dislikers: {
            type: new GraphQLList(UserType),
            resolve: ({dislikersIds}, args, context) => UsersController.FindAllUsersByIds(dislikersIds)
        },
    })
})

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: _ => ({
        id: {type: GraphQLID},
        text: {type: GraphQLString},
        post: {
            type: PostType,
            resolve: ({postId}, args, context) => PostsController.FindPostById(postId)
        },
        likers: {
            type: new GraphQLList(UserType),
            resolve: ({likersIds}, args, context) => UsersController.FindAllUsersByIds(likersIds)
        },
        dislikers: {
            type: new GraphQLList(UserType),
            resolve: async ({dislikersIds}, args, context) => UsersController.FindAllUsersByIds(dislikersIds)
        },
        likes: {
            type: GraphQLInt,
            resolve: ({likersIds}, args, context) => likersIds.length
        },
        dislikes: {
            type: GraphQLInt,
            resolve: ({dislikersIds}, args, context) => dislikersIds.length
        },
        author: {
            type: UserType,
            resolve: ({authorId}, args, context) => UsersController.FindUserById(authorId)
        },
    })
})

module.exports = {
    UserType,
    PostType,
    CommentType,
    AuthType,
}