const {
    User,
    Post,
    Comment
} = require('./schemas')

exports.getAllPosts = async function (){
    const Posts = mongoose.model('Posts', Post)
    let result={}
    
    try {
        result = await Posts.find((error, doc, res) => {
            return {error, doc, res}
        })
    } catch (error) {
        result.error = error        
    }
    return result
}