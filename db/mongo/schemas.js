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
    interests: [String]
})

const Comment = new Schema({
    text: {type: String, required: true},
    picture: String,
    postId: {type: ObjectId, required: true},
    likersIds: [ObjectId],
    dislikersIds: [ObjectId],
    authorId: {type: ObjectId, required: () => this.authorId !== null},
    timestamp : { type : Date, default: Date.now },
})

const Post = new Schema({
    text: {type: String, required: true},
    picture: String,
    tags: [String],
    authorId: {type: ObjectId, required: () => this.authorId !== null },
    commentsIds: [ObjectId],
    likersIds: [ObjectId],
    dislikersIds: [ObjectId],
    tagsIds: [ObjectId],
    timestamp : { type : Date, default: Date.now },
})

const Event = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    description: {type: String, required: true},
    level: {type: String, required: true, enum: ["beginner","intermediate","advanced"]},
    creatorId: {type: ObjectId, required: () => this.creatorId !== null },
    participantsIds: [ObjectId],
    postsIds: [Post],
    dateFrom: {type: String, required: true},
    timeFrom: {type: String, required: true},
    timeTo: {type: String, required: true, 
    timestamp : { type : Date, default: Date.now },
        // validate: timeTo => validate(timeTo)
    },
})

const Message = new Schema({
    authorId: {type: ObjectId, required: () => this.creator !== null},
    timestamp : { type : Date, default: Date.now },
    text: {type: String, required: true},
})

const ChatRoom = new Schema({
    participantsIds: [ObjectId],
    messages: [Message],
    creatorId: {type: ObjectId, required: true},
    title: String,
})

module.exports = {
    Users: mongoose.models.Users || mongoose.model('Users', User),
    Comments: mongoose.models.Comments || mongoose.model('Comments', Comment), 
    Posts: mongoose.models.Posts || mongoose.model('Posts', Post),
    ChatRooms: mongoose.models.ChatRooms || mongoose.model('ChatRooms', ChatRoom),
    Messages: mongoose.models.Messages || mongoose.model('Messages', Message),
    Events: mongoose.models.Events || mongoose.model('Events', Event),
}