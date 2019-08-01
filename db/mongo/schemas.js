const mongoose = require('mongoose')
const {MONGO_URI} = require('./secrets')
const logger = require('../../logger')

mongoose.connect(MONGO_URI, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
        .then( _ => logger.info('Successful Database connection'))
        .catch( err => logger.fatal('Database authentication error !', err))
        
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: String,
    fullname: String,
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
    Users: mongoose.models.Users || mongoose.model('Users', User),
    Comments: mongoose.models.Comments || mongoose.model('Comments', Comment), 
    Posts: mongoose.models.Posts || mongoose.model('Posts', Post),
}