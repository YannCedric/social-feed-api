const mongoose = require('mongoose')
const {
    MONGO_ADDRESS,
    USERNAME,
    DB_PASS,
    DB_PORT,
    AUTH_DB, } = require('./secrets')

mongoose.connect(`mongodb://${USERNAME}:${DB_PASS}@${MONGO_ADDRESS}:${DB_PORT}/${AUTH_DB}`)
        .catch( err => console.error('Database authentication error !',err))
        
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Tag = new Schema({
    value: String,
    icon: String,
    description: String,
})

const Comment = new Schema({
    text: String,
    postId: ObjectId,
    likes: [ObjectId],
    dislikes: [ObjectId],
    authorId: ObjectId,
})

const Post = new Schema({
    text: String,
    picture: String,
    authorId: ObjectId,
    commentIds: [ObjectId],
    tagIds: [ObjectId]
})

const User = new Schema({
    name: String,
    picture: String,
    bio: String,
    followersIds: [ObjectId],
    followingIds: [ObjectId]
})

module.exports = {
    Users,
    Comments, 
    Post,
}