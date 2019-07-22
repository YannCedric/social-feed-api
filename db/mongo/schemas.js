const mongoose = require('mongoose')
const {
    MONGO_ADDRESS,
    USERNAME,
    DB_PASS,
    DB_PORT,
    AUTH_DB, } = require('./secrets')

mongoose.connect(`mongodb://${USERNAME}:${DB_PASS}@${MONGO_ADDRESS}:${DB_PORT}/${AUTH_DB}`, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
        .then( _ => console.log('Successful Database connection'))
        .catch( err => console.error('Database authentication error !', err))
        
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    fullname: String,
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    picture: String,
    bio: String,
    followersIds: [ObjectId],
    followingIds: [ObjectId],
})

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
    tagIds: [ObjectId],
})

module.exports = {
    Users: mongoose.model('Users', User),
    Comments: mongoose.model('Comments', Comment), 
    Posts: mongoose.model('Posts', Post),
    Tags: mongoose.model('Tags', Tag),
}