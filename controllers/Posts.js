const {
    Find,
    FindWithPaging,
    FindById,
    Update,
    FindAllByIds,
    Create, 
} = require('../db')

class Posts {
    static async CreatePost(user) {
        return Create('posts',user)
    }
    static async UpdatePost(data) {
        return Update('posts', data)
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
    static async GetAllCommentsByIds(ids){
        return FindAllByIds('comments',ids)
    }
}

module.exports = Posts