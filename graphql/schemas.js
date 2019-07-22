const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
} = require('graphql')

const UsersController = require('../controllers/Users')

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

// const PostType = new GraphQLObjectType({
//     name: 'Post',
//     fields: _ => ({
//         text: {type: GraphQLString},
//         picture: {type: GraphQLString},
//         author: {
//             type: UserType,
//             // resolve: async (parent, args, context) => {
//             // }
//         },
//         // commentIds: _ => ({}),
//         // tagIds: _ => ({}),
//     })
// })

// const CommentType = new GraphQLObjectType({
//     name: 'Post',
//     fields: _ => ({
//         text: {type: GraphQLString},
//         postId: GraphQLID,
//         likes: [ObjectId],
//         dislikes: [ObjectId],
//         authorId: ObjectId,
//         // commentIds: _ => ({}),
//         // tagIds: _ => ({}),
//     })
// })

module.exports = {
    UserType,
}