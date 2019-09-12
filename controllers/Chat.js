const {
    FindOne,
    Create,
    Update,
    Find,
    FindWithPaging,
    DeleteOne,
} = require('../db')

class Chat {
    static async SendDirectMessage({receiverId, senderId, text}) {
        const chatId = `DM-${[receiverId, senderId].sort().join('-')}`
        let chatroom = await FindOne('chatrooms',{title: chatId})
        const message = await Create('messages',{ authorId: senderId, text })
        if(!chatroom){
            return await Create('chatrooms', {
                        creatorId: senderId,
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

    static async CreateChatRoom({creatorId, title}){
        return Create('chatrooms', {
            creatorId,
            participantsIds: [creatorId],
            title: title,
        })
    }

    static async SendRoomMessage({roomId:id, text, senderId:authorId}){
        const message = await Create('messages',{ authorId, text })
        console.log({message})
        return Update('chatrooms', { id, $push: {messages: message} })
    }

    static async EditChatRoom({id,title,editorId}){
        const room = await FindOne("chatrooms",{_id:id})
        if(!room.creatorId.equals(editorId)){
            throw Error("User doesn't have the right to edit this chatroom.")
        } else 
            return Update('chatrooms', {id,title} )
    }

    static async DeleteChatRoom({id:_id,deleterId}){
        const room = await FindOne("chatrooms",{_id})
        if(!room.creatorId.equals(deleterId)){
            throw Error("User doesn't have the right to delete this chatroom.")
        } else 
            return DeleteOne('chatrooms',_id)
    }

}
module.exports = Chat
