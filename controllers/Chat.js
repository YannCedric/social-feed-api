const {
    FindOne,
    Create,
    Update,
} = require('../db')

class Chat {
    static async SendDirectMessage({receiverId, senderId, text}) {
        const dmId = `DM-${[receiverId, senderId].sort().join('-')}`
        let chatroom = await FindOne('chatrooms',{title: dmId})
        const message = await Create('messages',{ authorId: senderId, text })
        if(!chatroom){
            return await Create('chatrooms', {
                        participantsIds: [senderId,receiverId],
                        messages: [message],
                        title: dmId,
                    }).catch(console.log)
        }
        const chat = await Update('chatrooms', {
                        id: chatroom._id,
                        $push: {messages: message}
                    }).catch(console.log)
        return chat

    }
}
module.exports = Chat
