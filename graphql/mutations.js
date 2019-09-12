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
} = require('./schemas')

const UsersController = require('../controllers/Users')
const PostsController = require('../controllers/Posts')
const ChatController = require('../controllers/Chat')

const CreateUser = {
    type: AuthType,
    args: { 
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
        username: {type: GraphQLString},
        fullname: {type: GraphQLString},
        picture: {type: GraphQLString},
        bio: {type: GraphQLString}, 
    },
    resolve: async (_, args, context) => {
        const {User,token} = await UsersController.CreateUser(args)
        if (context.pubsub) context.pubsub.publish('user', {UsersSub: User})
        return {User, token}
    }
}

const UpdateProfile = {
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

const CreatePost = { // Protected Route
    type: PostType,
    args: {
        text: {type: new GraphQLNonNull(GraphQLString)},
        picture: {type: GraphQLString},
        tags: {type: new GraphQLList(GraphQLString)},
    },
    resolve: (_, args, {bearerId:authorId}) => PostsController.CreatePost({...args, authorId})
}

const UpdatePost = { // Protected Route
    type: PostType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: GraphQLString},
        picture: {type: GraphQLString},
        tags: {type: new GraphQLList(GraphQLString)},
    },
    resolve: (_, args, {bearerId:authorId}) => PostsController.UpdatePost({...args, authorId})
}

const LikePost = { // Protected Route
    type: PostType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id: postId}, {bearerId:likerId}) => PostsController.LikePost({postId, likerId})
}

const DislikePost = { // Protected Route
    type: PostType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id: postId}, {bearerId:likerId}) => PostsController.DislikePost({postId, likerId})
}

const MakeComment = { // Protected Route
    type: CommentType,
    args: {
        postId: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: new GraphQLNonNull(GraphQLString)},
        picture: {type: GraphQLString},
    },
    resolve: (_, args, {bearerId:authorId}) => PostsController.MakeComment({...args, authorId})
}

const EditComment = { // Protected Route
    type: CommentType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: GraphQLString},
        picture: {type: GraphQLString},
    },
    resolve: (_, {id, text, picture}, {bearerId:editorId}) => PostsController.UpdateComment({id, text, picture,editorId})
}

const LikeComment = { // Protected Route
    type: CommentType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id: commentId}, {bearerId:likerId}) => PostsController.LikeComment({commentId, likerId})
}

const DisLikeComment = { // Protected Route
    type: CommentType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id: commentId}, {bearerId:dislikerId}) => PostsController.DisLikeComment({commentId, dislikerId})
}

const DeleteComment = { // Protected Route
    type: CommentType,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id: commentId}, {bearerId:deleterId}) => PostsController.DeleteComment({commentId, deleterId})
}

const SendDirectMessage = {
    type: ChatRoom,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: (_, {id: receiverId, text}, {bearerId:senderId}) => ChatController.SendDirectMessage({receiverId, senderId, text})
}

const SendRoomMessage = {
    type: ChatRoom,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: (_, {id: roomId, text}, {bearerId:senderId}) => ChatController.SendRoomMessage({roomId, text, senderId})
}

const CreateChatRoom = {
    type: ChatRoom,
    args: {
        title: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: (_, {title}, {bearerId:creatorId}) => ChatController.CreateChatRoom({creatorId, title})
}

const EditChatRoom = {
    type: ChatRoom,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        title: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: (_, {id,title}, {bearerId:editorId}) => ChatController.EditChatRoom({id,title,editorId})
}

const DeleteChatRoom = {
    type: ChatRoom,
    args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: (_, {id}, {bearerId:deleterId}) => ChatController.DeleteChatRoom({id,deleterId})
}

module.exports = {
    CreateUser,
    UpdateProfile,
    CreatePost,
    UpdatePost,
    MakeComment,
    EditComment,
    LikePost,
    DislikePost,
    LikeComment,
    DisLikeComment,
    DeleteComment,
    SendDirectMessage,
    SendRoomMessage,
    CreateChatRoom,
    EditChatRoom,
    DeleteChatRoom,
}