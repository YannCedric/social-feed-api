const moment = require('moment')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLInt,
} = require('graphql')

const UsersController = require('../controllers/Users')
const PostsController = require('../controllers/Posts')
const EventsController = require('../controllers/Events')

const AuthType = new GraphQLObjectType({
    name: 'Auth',
    fields: _ => ({
        User: { type: UserType },
        token: { type: GraphQLString },
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: _ => ({
        id: { type: GraphQLID },
        fullname: { type: GraphQLString },
        email: { type: GraphQLString },
        username: { type: GraphQLString },
        picture: {
            type: GraphQLString,
            resolve: ({ picture }, _, __) => picture ?? "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png"
        },
        bio: { type: GraphQLString },
        interests: { type: new GraphQLList(GraphQLString) },
        followers: {
            type: GraphQLList(UserType),
            resolve: ({ followersIds }, _, __) => UsersController.FindAllUsersByIds(followersIds)
        },
        following: {
            type: GraphQLList(UserType),
            resolve: ({ followingIds }, _, __) => UsersController.FindAllUsersByIds(followingIds)
        },
        eventsJoined: {
            type: GraphQLList(EventType),
            resolve: ({ id }, __, ___) => EventsController.GetUserEvents(id)
        }
    })
})

const FollowType = new GraphQLObjectType({
    name: 'Follow',
    fields: _ => ({
        userSource: { type: UserType },
        userTarget: { type: UserType },
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: _ => ({
        id: { type: GraphQLID },
        text: { type: GraphQLString },
        picture: { type: GraphQLString },
        tags: { type: new GraphQLList(GraphQLString) },
        timestamp: {
            type: GraphQLString,
            resolve: ({ timestamp }, _, __) => {
                const d = new Date(0)
                d.setTime(timestamp)
                let time = moment(d).fromNow()
                return time
            }
        },
        author: {
            type: UserType,
            resolve: ({ authorId }, args, context) => UsersController.FindUserById(authorId)
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve: ({ commentsIds }, args, context) => PostsController.GetAllCommentsByIds(commentsIds)
        },
        likers: {
            type: new GraphQLList(UserType),
            resolve: ({ likersIds }, args, context) => UsersController.FindAllUsersByIds(likersIds)
        },
        dislikers: {
            type: new GraphQLList(UserType),
            resolve: ({ dislikersIds }, args, context) => UsersController.FindAllUsersByIds(dislikersIds)
        },
    })
})

const EventType = new GraphQLObjectType({
    name: 'Event',
    fields: _ => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        type: { type: GraphQLString },
        level: { type: GraphQLString },
        description: { type: GraphQLString },
        tags: { type: new GraphQLList(GraphQLString) },
        timestamp: {
            type: GraphQLString,
            resolve: ({ timestamp }, _, __) => {
                const d = new Date(0)
                d.setTime(timestamp)
                let time = moment(d).fromNow()
                return time
            }
        },
        creator: {
            type: UserType,
            resolve: ({ creatorId }, args, context) => UsersController.FindUserById(creatorId)
        },
        participants: {
            type: new GraphQLList(UserType),
            resolve: ({ participantsIds }, _, __) => UsersController.FindAllUsersByIds(participantsIds)
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: ({ postsIds }, _, __) => PostsController.FindAllPostsByIds(postsIds)
        },
        logo: {
            type: GraphQLString,
            resolve: ({ type }, _, __) => PostsController.getLogo(type)
        },
        illustration: {
            type: GraphQLString,
            resolve: ({ type }, _, __) => PostsController.getIllustration(type)
        },
    })
})

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: _ => ({
        id: { type: GraphQLID },
        text: { type: GraphQLString },
        timestamp: {
            type: GraphQLString,
            resolve: ({ timestamp }, _, __) => {
                const d = new Date(0)
                d.setTime(timestamp)
                let time = moment(d).fromNow()
                return time
            }
        },
        post: {
            type: PostType,
            resolve: ({ postId }, args, context) => PostsController.FindPostById(postId)
        },
        likers: {
            type: new GraphQLList(UserType),
            resolve: ({ likersIds }, args, context) => UsersController.FindAllUsersByIds(likersIds)
        },
        dislikers: {
            type: new GraphQLList(UserType),
            resolve: async ({ dislikersIds }, args, context) => UsersController.FindAllUsersByIds(dislikersIds)
        },
        likes: {
            type: GraphQLInt,
            resolve: ({ likersIds }, args, context) => likersIds.length
        },
        dislikes: {
            type: GraphQLInt,
            resolve: ({ dislikersIds }, args, context) => dislikersIds.length
        },
        author: {
            type: UserType,
            resolve: ({ authorId }, args, context) => UsersController.FindUserById(authorId)
        },
    })
})

const ChatMessage = new GraphQLObjectType({
    name: 'ChatMessage',
    fields: _ => ({
        creator: {
            type: UserType,
            resolve: ({ authorId }, _, __) => UsersController.FindUserById(authorId)
        },
        timestamp: {
            type: GraphQLString,
            resolve: ({ timestamp }, _, __) => {
                const d = new Date(0)
                d.setTime(timestamp)
                let time = moment(d).fromNow()
                return time
            }
        },
        text: { type: GraphQLString },
    })
})

const ChatRoom = new GraphQLObjectType({
    name: 'ChatRoom',
    fields: _ => ({
        id: { type: GraphQLID },
        participants: {
            type: new GraphQLList(UserType),
            resolve: ({ participantsIds }, _, __) => UsersController.FindAllUsersByIds(participantsIds)
        },
        messages: { type: new GraphQLList(ChatMessage) },
        creator: {
            type: UserType,
            resolve: ({ creatorId }, _, __) => UsersController.FindUserById(creatorId)
        },
        title: { type: GraphQLString },
        lastMessage: {
            type: ChatMessage,
            resolve: ({ messages = [] }, _, __) => {
                messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                return messages[0]
            }
        },
    })
})


module.exports = {
    UserType,
    PostType,
    CommentType,
    AuthType,
    ChatRoom,
    ChatMessage,
    EventType,
    FollowType,
}