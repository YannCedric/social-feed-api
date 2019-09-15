const {
    GraphQLNonNull,
    GraphQLID,
    GraphQLString,
} = require('graphql')

const {
    ChatMessage,
} = require('./schemas')

const ChatController = require('../controllers/Chat')
const UserController = require('../controllers/Users')

const ChatStream = {
    type: ChatMessage,
    args: { 
        id: {type: new GraphQLNonNull(GraphQLID)},
        token: {type: new GraphQLNonNull(GraphQLString)},
     },
    subscribe: async (_, {id:chatId,token}, {pubsub}) => {
        const bearerId = await UserController.VerifyToken(token)
        return ChatController.SubscribeToChat({bearerId,chatId,pubsub})
    }
}

module.exports = {
    ChatStream
}