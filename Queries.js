const mongoose = require('mongoose')
const _ = require('lodash')

const {MONGO_ADDRESS='localhost', USERNAME='test', DB_PASS='test', DB_PORT=8080, AUTH_DB= 'admin'} = process.env

mongoose.connect(`mongodb://${USERNAME}:${DB_PASS}@${MONGO_ADDRESS}:${DB_PORT}/${AUTH_DB}`, { useNewUrlParser: true })
        .catch( err => console.error('Database authentication error !',err))
        
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Comment = new Schema({
    _id: ObjectId,
    text: String,
    postId: ObjectId,
    likes: [ObjectId],
    dislikes: [ObjectId],
    authorId: ObjectId,
})

const Post = new Schema({
    _id: ObjectId,
    text: String,
    authorId: ObjectId,
    comments: [Comment],
    tags: [String]
})

const User = new Schema({
    _id: ObjectId,
    name: String,
    picture: String,
    bio: String,
    followers: [ObjectId],
    following: [ObjectId]
})

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

exports.searchPosts = async function ({authorId, content, tags}){
    const Posts = mongoose.model('Posts', Post)
    let result={}
    
    let query = {}
    query.authorId = authorId? mongoose.Types.ObjectId.ObjectId(authorId) : undefined
    query.tags = tags? tags : undefined
    query['comments.text'] = content? {$regex:content, "$options": "i"} : undefined
    query = _.pickBy(query, _.identity)

    try {
        result = await Posts.find(query,
                                    (error, doc, res) => {
            return {error, doc, res}
        })
    } catch (error) {
        result.error = error        
    }
    return result
}

exports.getAllPostsByUser = async function (authorId){
    const Posts = mongoose.model('Posts', Post)
    let result={}
    
    try {
        result = await Posts.find({"authorId":  mongoose.Types.ObjectId.ObjectId(authorId) },(error, doc, res) => {
            return {error, doc, res}
        })
    } catch (error) {
        result.error = error        
    }
    return result
}

exports.getAllProfiles = async function (idsArray){
    const Users = mongoose.model('Users', User)
    let result={}
    const mongoIds = idsArray.map(mongoose.Types.ObjectId.ObjectId)

    try {
        result = await Users.find({"_id": {$in: mongoIds}})
    } catch (error) {
        result.error = error        
    }
    return result
}

exports.upsertUser = async function ({_id, name, picture, bio, followers, following}){
    const Users = mongoose.model('users', User)
    let result={}

    let newData = _.pickBy({_id, name, picture, bio, followers, following}, _.identity)
    newData._id = mongoose.Types.ObjectId.ObjectId(newData._id)
    
    try {
        result = await Users.findOneAndUpdate({"_id": newData._id}, newData, {upsert: true},  (error, doc, res) => {
            return {error, doc, res}
        })
    } catch (error) {
        result.error = error        
    }
    return result
}

exports.getUserData = async function (_id){
    const Users = mongoose.model('Users', User)
    let result={}

    try {
        result = await Users.findOne({"_id": mongoose.Types.ObjectId(_id)})
    } catch (error) {
        result.error = error        
    }
    return result
}

exports.deleteUser = async function (_id){
    const Users = mongoose.model('Users', User)
    let result={}

    try {
        result = await Users.deleteOne({"_id": mongoose.Types.ObjectId(_id)})
    } catch (error) {
        result.error = error        
    }
    return result
}

exports.upsertPost = async function ({_id, text, authorId, comments, tags}){
    const Posts = mongoose.model('Posts', Post)

    const newData = _.pickBy({_id, text, authorId, comments, tags}, _.identity)
    // const newData = {_id: mongoose.Types.ObjectId.ObjectId(_id), text, authorId, comments, tags}
    
    let result={}
    try {
        result = await Posts.findOneAndUpdate({ "_id": mongoose.Types.ObjectId.ObjectId(newData._id)},
                                                 newData , {upsert:true}, (error, doc, res) => {
            return {error, doc, res}
        })
    } catch (error) {
        result.error = error        
    }
    return result
}

exports.deletePost = async function (_id){
    const Posts = mongoose.model('Posts', Post)
    
    let result={}
    try {
        result = await Posts.deleteOne({ "_id": mongoose.Types.ObjectId.ObjectId(_id)}, (error, doc, res) => {
            return {error, doc, res}
        })
    } catch (error) {
        result.error = error        
    }
    return result
}

exports.upsertComment = async function ({_id, text, postId, likes, dislikes, authorId}){
    const Posts = mongoose.model('Posts', Post)

    let newData = _.pickBy({_id, text, postId, likes, dislikes, authorId}, _.identity)

    newData._id = mongoose.Types.ObjectId.ObjectId(newData._id)
    let result={}
    await Posts.updateOne({ "_id": mongoose.Types.ObjectId.ObjectId(newData.postId)},
                                            {$pull:  {"comments": {"_id": newData._id}} })
    try {
        result = await Posts.updateOne({ "_id": mongoose.Types.ObjectId.ObjectId(newData.postId)},
                                            {$push:  {"comments": newData} },
                                            {upsert: true, new: true})
    } catch (error) {
        result.error = error        
    }
    return result
}

exports.deleteComment = async function ({_id, postId}){
    const Posts = mongoose.model('Posts', Post)

    let result={}
    
    try {
        result = await Posts.updateOne({ "_id": mongoose.Types.ObjectId.ObjectId(postId)},
                                    {$pull:  {"comments": {"_id": mongoose.Types.ObjectId.ObjectId(_id)}} })
    } catch (error) {
        result.error = error        
    }
    return result
}