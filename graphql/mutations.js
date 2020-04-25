const {
    GraphQLString,
    GraphQLID,
    GraphQLNonNull,
    GraphQLList,
} = require('graphql')

const {
    UserType,
    PostType,
    CommentType,
    AuthType,
    ChatRoom,
    EventType,
    FollowType,
} = require('./schemas')

const UsersController = require('../controllers/Users')
const PostsController = require('../controllers/Posts')
const ChatController = require('../controllers/Chat')
const EventsController = require('../controllers/Events')

module.exports.UserSignUp = {
    type: AuthType,
    args: { 
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
        username: {type: new GraphQLNonNull(GraphQLString)},
        interests: {type: new GraphQLList(GraphQLString)},
        fullname: {type: GraphQLString},
        picture: {type: GraphQLString},
        bio: {type: GraphQLString}, 
    },
    resolve: async (_, args, context) => {
        const {User,token} = await UsersController.UserSignUp(args)
        return {User, token}
    }
}

module.exports.UserFollow = {
    type: FollowType,
    args: { 
        id: {type: new GraphQLNonNull(GraphQLID)}
    },
    resolve: async (_ , {id:followingId}, {bearerId:followerId}) => UsersController.UserFollow({followerId, followingId})
}

module.exports.UserUnFollow = {
    type: FollowType,
    args: { 
        id: {type: new GraphQLNonNull(GraphQLID)}
    },
    resolve: async (_ , {id:unfollowingId}, {bearerId:unfollowerId}) => UsersController.UserUnFollow({unfollowerId, unfollowingId})
}


module.exports.UserUpdate = {
    type: UserType,
    args: { 
        fullname: {type: GraphQLString},
        email: {type: GraphQLString},
        username: {type: GraphQLString},
        picture: {type: GraphQLString},
        bio: {type: GraphQLString}, 
    },
    resolve: (_, args, {bearerId}) => UsersController.UpdateUser({...args, id: bearerId})
}

module.exports.PostCreate = {
    type: PostType,
    args: {
        text: {type: new GraphQLNonNull(GraphQLString)},
        picture: {type: GraphQLString},
        tags: {type: new GraphQLList(GraphQLString)},
    },
    resolve: (_, args, {bearerId:authorId}) => PostsController.PostCreate({...args, authorId})
}

module.exports.EventCreate = {
    type: EventType,
    args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        type: {type: new GraphQLNonNull(GraphQLString)},
        level: {type: new GraphQLNonNull(GraphQLString)},
        description: {type: new GraphQLNonNull(GraphQLString)},
        dateFrom: {type: new GraphQLNonNull(GraphQLString)},
        timeFrom: {type: new GraphQLNonNull(GraphQLString)},
        timeTo: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: (_, args, {bearerId:creatorId}) => EventsController.EventCreate({...args, creatorId, participantsIds: [creatorId]})
}

module.exports.PostUpdate = {
    type: PostType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: GraphQLString},
        picture: {type: GraphQLString},
        tags: {type: new GraphQLList(GraphQLString)},
    },
    resolve: (_, args, {bearerId:authorId}) => PostsController.PostUpdate({...args, authorId})
}

module.exports.PostLike = {
    type: PostType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id: postId}, {bearerId:likerId}) => PostsController.PostLike({postId, likerId})
}

module.exports.PostDislike = {
    type: PostType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id: postId}, {bearerId:likerId}) => PostsController.PostDislike({postId, likerId})
}

module.exports.PostDelete = {
    type: PostType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id: postId}, {bearerId:deleterId}) => PostsController.PostDelete({postId, deleterId})
}

module.exports.CommentCreate = {
    type: CommentType,
    args: {
        postId: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: new GraphQLNonNull(GraphQLString)},
        picture: {type: GraphQLString},
    },
    resolve: (_, args, {bearerId:authorId}) => PostsController.CommentCreate({...args, authorId})
}

module.exports.CommentUpdate = {
    type: CommentType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: GraphQLString},
        picture: {type: GraphQLString},
    },
    resolve: (_, {id, text, picture}, {bearerId:editorId}) => PostsController.UpdateComment({id, text, picture,editorId})
}

module.exports.CommentLike = {
    type: CommentType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id: commentId}, {bearerId:likerId}) => PostsController.CommentLike({commentId, likerId})
}

module.exports.CommentDisLike = {
    type: CommentType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id: commentId}, {bearerId:dislikerId}) => PostsController.CommentDisLike({commentId, dislikerId})
}

module.exports.CommentDelete = {
    type: CommentType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id: commentId}, {bearerId:deleterId}) => PostsController.CommentDelete({commentId, deleterId})
}

module.exports.SendDirectMessage = {
    type: ChatRoom,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: (_, {id: receiverId, text}, {bearerId:senderId, pubsub}) => ChatController.SendDirectMessage({receiverId, senderId, text, pubsub})
}

module.exports.SendRoomMessage = {
    type: ChatRoom,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: (_, {id: roomId, text}, {bearerId:senderId,pubsub}) => ChatController.SendRoomMessage({roomId, text, senderId,pubsub})
}

module.exports.ChatRoomCreate = {
    type: ChatRoom,
    args: {
        title: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: (_, {title}, {bearerId:creatorId}) => ChatController.ChatRoomCreate({creatorId, title})
}

module.exports.ChatRoomEdit = {
    type: ChatRoom,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        title: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: (_, {id,title}, {bearerId:editorId}) => ChatController.ChatRoomEdit({id,title,editorId})
}

module.exports.ChatRoomDelete = {
    type: ChatRoom,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id}, {bearerId:deleterId}) => ChatController.ChatRoomDelete({id,deleterId})
}

module.exports.EventJoin = {
    type: EventType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id}, {bearerId:joinerId}) => EventsController.EventJoin({id,joinerId})
}

module.exports.EventLeave = {
    type: EventType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id}, {bearerId:leaverId}) => EventsController.EventLeave({id,leaverId})
}