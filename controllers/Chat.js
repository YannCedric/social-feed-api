const {
    FindOne,
    Create,
    Update,
    Find,
    FindWithPaging,
} = require('../db')

class Chat {
    static async SendDirectMessage({receiverId, senderId, text}) {
        const chatId = `DM-${[receiverId, senderId].sort().join('-')}`
        let chatroom = await FindOne('chatrooms',{title: chatId})
        const message = await Create('messages',{ authorId: senderId, text })
        if(!chatroom){
            return await Create('chatrooms', {
                        participantsIds: [senderId,receiverId],
                        messages: [message],
                        title: chatId,
                    }).catch(console.log)
        }
        const chat = await Update('chatrooms', {
                        id: chatroom._id,
                        $push: {messages: message}
                    }).catch(console.log)
        return chat

    }

    static async FindChats(bearerId) {
        return await Find('chatrooms',{participantsIds: bearerId})
    }

    static async FindChatsWithPaging(bearerId, from, limit) {
        return await FindWithPaging('chatrooms',from,limit,{participantsIds: bearerId})
    }
}
module.exports = Chat
