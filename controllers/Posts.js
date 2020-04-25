const {
    Find,
    FindWithPaging,
    FindOne,
    FindById,
    Update,
    FindAllByIds,
    Create,
    DeleteOne,
} = require('../db')

class Posts {
    static async PostCreate(user) {
        return Create('posts',user)
    }
    static async PostUpdate(data) {
        return Update('posts', data)
    }
    static async PostDelete({postId:_id,deleterId}){
        const post = await FindOne("posts",{_id})
        if(!post.authorId.equals(deleterId)){
            throw Error("User doesn't have the right to delete this post.")
        } else 
            return DeleteOne('posts',_id)
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
    static async CommentCreate(data) {
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
    static async PostLike({postId, likerId}){
        return Update('posts',{ id: postId, 
                                $pull: {dislikersIds: likerId}, 
                                $addToSet: {likersIds: likerId} })
    }
    static async CommentLike({commentId, likerId}){
        return Update('comments',{ id: commentId, 
                                $pull: {dislikersIds: likerId}, 
                                $addToSet: {likersIds: likerId} })
    }
    static async CommentDisLike({commentId, dislikerId}){
        return Update('comments',{ id: commentId, 
                                $pull: {likersIds: dislikerId}, 
                                $addToSet: {dislikersIds: dislikerId} })
    }
    static async CommentDelete({commentId, deleterId}){
        const comment = await FindById('comments',commentId)
        if(!comment) {
            throw Error("Comment doesn't exist !.")
        } else if(!comment.authorId.equals(deleterId)){
            throw Error("User doesn't have the right to delete this comment.")
        } else 
            return DeleteOne('comments',commentId)
    }
    static async PostDislike({postId, likerId}){
        return Update('posts',{ id: postId, 
                                $pull: {likersIds: likerId}, 
                                $addToSet: {dislikersIds: likerId} })
    }
    static async GetAllCommentsByIds(ids){
        return FindAllByIds('comments',ids)
    }

    static async getIllustration(type){
        switch (type) {
          case 'Yoga':
            return 'https://ak3.picdn.net/shutterstock/videos/11970506/thumb/2.jpg?i10c=img.resize'
          case 'Oly':
            return 'https://liftlabco.com/wp-content/uploads/2015/11/Wideshot.jpg'
          case 'Jiu Jitsu':
            return 'https://firebasestorage.googleapis.com/v0/b/data-90ae4.appspot.com/o/Images%2FPictures%2Fbjj.jpg?alt=media&token=3bc0bd8d-7a8e-4362-936d-bcf86063b628'
          case 'Gym':
            return 'https://ak7.picdn.net/shutterstock/videos/12609467/thumb/3.jpg'
          case 'Basketball':
            return 'https://ak5.picdn.net/shutterstock/videos/19964830/thumb/2.jpg'
          case 'Biking':
            return 'https://firebasestorage.googleapis.com/v0/b/data-90ae4.appspot.com/o/Images%2FPictures%2Fbike.jpeg?alt=media&token=3a06a0e8-9fcf-4230-8c48-c736510d9ec8'
          case 'Kayaking':
            return 'https://firebasestorage.googleapis.com/v0/b/data-90ae4.appspot.com/o/Images%2FPictures%2Fkayak.jpg?alt=media&token=9af653e8-30b6-45e7-9aab-050cfb2e48c0'
          case 'Swimming':
            return 'https://dncache-mauganscorp.netdna-ssl.com/thumbseg/1301/1301177-bigthumbnail.jpg'
          case 'Running':
            return 'https://firebasestorage.googleapis.com/v0/b/data-90ae4.appspot.com/o/Images%2FPictures%2Frunning.jpg?alt=media&token=407e3cba-bca0-4c1e-8913-b741691e512b'
          case 'Football Practice':
            return 'http://news.psu.edu/sites/default/files/styles/photo_gallery_large/public/Spring%20Football%20Practice%2031813-003.jpg?itok=7zVQljSx'
          case 'Football Game':
            return 'https://bloximages.chicago2.vip.townnews.com/host.madison.com/content/tncms/assets/v3/editorial/7/82/782c50bd-4235-574d-83b4-8c134d453391/58c09eca27786.image.jpg?resize=1200%2C726'
          default:
            return 'https://ak3.picdn.net/shutterstock/videos/11970506/thumb/2.jpg?i10c=img.resize'
        }
    }

    static async getLogo(type){
        switch (type) {
          case 'Yoga':
            return 'https://image.flaticon.com/icons/png/128/84/84145.png'
          case 'Oly':
            return 'https://image.flaticon.com/icons/png/128/8/8295.png'
          case 'Jiu Jitsu':
            return 'https://firebasestorage.googleapis.com/v0/b/data-90ae4.appspot.com/o/Images%2FIcons%2Fbjj_icon.png?alt=media&token=e2a10f2c-e40d-48e5-a7c4-9176de8d9b26'
          case 'Gym':
            return 'https://d30y9cdsu7xlg0.cloudfront.net/png/883-200.png'
          case 'Basketball':
            return 'https://image.flaticon.com/icons/png/512/46/46106.png'
          case 'Biking':
            return 'https://d30y9cdsu7xlg0.cloudfront.net/png/381770-200.png'
          case 'Kayaking':
            return 'https://cdn3.iconfinder.com/data/icons/water-sports-and-recreation-tours/512/Water_sports_and_recreation_tours_Canoeing-512.png'
          case 'Running':
            return 'https://d30y9cdsu7xlg0.cloudfront.net/png/783354-200.png'
          case 'Swimming':
            return 'https://firebasestorage.googleapis.com/v0/b/data-90ae4.appspot.com/o/Images%2FIcons%2Fswim.png?alt=media&token=b7a117f8-8dd8-46cf-9a3b-bb6c81392eea'
          case 'Football Practice':
            return 'https://www.shareicon.net/data/128x128/2015/10/19/658653_football_512x512.png'
          case 'Football Game':
            return 'https://i1.wp.com/www.swantonschools.org/wp-content/uploads/2016/07/American-Football-Ball-icon.png?fit=256%2C256'
          default:
            return 'https://d30y9cdsu7xlg0.cloudfront.net/png/381770-200.png'
        }
    }
}

module.exports = Posts