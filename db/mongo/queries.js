const {
    Users,
    Posts,
    Comments,
    Messages,
    ChatRooms,
} = require('./schemas')

module.exports.Update = async function (dbName, data){
    const db = getDb(dbName)
    return await findOneAndUpdate(db)(data)
}

module.exports.Find = async function (dbName, query){
    const db = getDb(dbName)
    return await find(db)(query)
}

module.exports.FindWithPaging = async function (dbName, from, limit, query){
    const db = getDb(dbName)
    return await findWithPaging(db)(from, limit)
}

module.exports.FindById = async function (dbName, id){
    const db = getDb(dbName)
    return await findById(db)(id)
}

module.exports.FindAllByIds = async function (dbName, ids){
    const db = getDb(dbName)
    return await findAllByIds(db)(ids)
}

module.exports.Create = async function (dbName, data){
    const db = getDb(dbName)
    await db.ensureIndexes()
    const newEntry = new db({...data})
    return await newEntry.save()
}

module.exports.FindOne = async function (dbName, query){
    const db = getDb(dbName)
    await db.ensureIndexes()
    return findOne(db)(query)
}

module.exports.DeleteOne = async function (dbName, id){
    const db = getDb(dbName)
    await db.ensureIndexes()
    return deleteOne(db)(id)
}

const findOneAndUpdate = db => entry => db.findOneAndUpdate({_id: entry.id}, entry, {new: true})
const findOne = db => entry => db.findOne(entry)
const find = db => query => db.find(query)
const findWithPaging = db => (from, limit, query) => db.find({...query, _id: {$gt: from}}).limit(limit)
const findById = db => id => db.findById(id)
const findAllByIds = db => ids => db.find({_id: { $in: ids} })
const deleteOne = db => id => db.deleteOne({_id: id })

const getDb = dbName => {
    switch(dbName) {
        case 'users':
            return Users
        case 'posts':
            return Posts
        case 'comments':
            return Comments
        case 'messages':
            return Messages
        case 'chatrooms':
            return ChatRooms
        default: 
            throw Error(`Database "${dbName}" is not known !`)
    }
}