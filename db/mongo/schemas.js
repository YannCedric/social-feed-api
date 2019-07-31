const mongoose = require('mongoose')
const {MONGO_URI} = require('./secrets')

mongoose.connect(MONGO_URI, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
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

const Comment = new Schema({
    text: {type: String, required: true},
    picture: String,
    postId: {type: ObjectId, required: true},
    likersIds: [ObjectId],
    dislikersIds: [ObjectId],
    authorId: {type: ObjectId, required: true},
})

const Post = new Schema({
    text: {type: String, required: true},
    picture: String,
    tags: [String],
    authorId: {type: ObjectId, required: true},
    commentsIds: [ObjectId],
    likersIds: [ObjectId],
    dislikersIds: [ObjectId],
    tagsIds: [ObjectId],
})

module.exports = {
    Users: mongoose.model('Users', User),
    Comments: mongoose.model('Comments', Comment), 
    Posts: mongoose.model('Posts', Post),
}