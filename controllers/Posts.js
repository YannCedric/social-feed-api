const {
    Find,
    FindWithPaging,
    FindById,
    Update,
    FindAllByIds,
    Create,
    DeleteOne,
} = require('../db')

class Posts {
    static async CreatePost(user) {
        return Create('posts',user)
    }
    static async UpdatePost(data) {
        return Update('posts', data)
    }
    static async UpdateComment({id, text, picture, editorId}) {
        const comment = await FindById('comments',id)
        if(!comment) {
            throw Error("Comment doesn't exist !.")
        } else if(!comment.authorId.equals(editorId)){
            throw Error("User doesn't have the right to edit this comment.")
        } else 
            return Update('comments', {id, text, picture})
    }
    static async MakeComment(data) {
        const newComment = await Create('comments', data)
        Update('posts', {id: newComment.postId, $push:{commentsIds: newComment.id}})
        return newComment
    }
    static async FindPosts(query){
        return Find('posts',query)
    }
    static async FindPostsWithPaging(from, limit){
        return FindWithPaging('posts',from, limit)
    }
    static async FindPostById(id){
        return FindById('posts',id)
    }
    static async FindAllPostsByIds(ids){
        return FindAllByIds('posts',ids)
    }
    static async LikePost({postId, likerId}){
        return Update('posts',{ id: postId, 
                                $pull: {dislikersIds: likerId}, 
                                $addToSet: {likersIds: likerId} })
    }
    static async LikeComment({commentId, likerId}){
        return Update('comments',{ id: commentId, 
                                $pull: {dislikersIds: likerId}, 
                                $addToSet: {likersIds: likerId} })
    }
    static async DisLikeComment({commentId, dislikerId}){
        return Update('comments',{ id: commentId, 
                                $pull: {likersIds: dislikerId}, 
                                $addToSet: {dislikersIds: dislikerId} })
    }
    static async DeleteComment({commentId, deleterId}){
        const comment = await FindById('comments',commentId)
        if(!comment) {
            throw Error("Comment doesn't exist !.")
        } else if(!comment.authorId.equals(deleterId)){
            throw Error("User doesn't have the right to delete this comment.")
        } else 
            return DeleteOne('comments',commentId)
    }
    static async DislikePost({postId, likerId}){
        return Update('posts',{ id: postId, 
                                $pull: {likersIds: likerId}, 
                                $addToSet: {dislikersIds: likerId} })
    }
    static async GetAllCommentsByIds(ids){
        return FindAllByIds('comments',ids)
    }
}

module.exports = Posts