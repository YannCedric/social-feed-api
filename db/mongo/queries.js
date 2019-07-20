const {
    Users,
    Posts,
    Comments,
    Tags,
} = require('./schemas')

async function Upsert (dbName, data){
    const db = getDb(dbName)
    return await findOneAndUpdate(db)(data)
}

async function Find (dbName, query){
    const db = getDb(dbName)
    return await find(db)(query)
}

async function FindById (dbName, id){
    const db = getDb(dbName)
    return await findById(db)(id)
}

async function FindAllByIds (dbName, ids){
    const db = getDb(dbName)
    return await findAllByIds(db)(ids)
}

const findOneAndUpdate = db => user => db.findOneAndUpdate({_id: user.id}, user, {new: true, upsert: true})
const find = db => query => db.find(query)
const findById = db => id => db.findOneAndUpdate(id)
const findAllByIds = db => ids => db.find({_id: { $in: ids} })

const getDb = dbName => {
    switch(dbName) {
        case 'users':
            return Users
        case 'posts':
            return Posts
        case 'comments':
            return Comments
        case 'tags':
            return Tags
        default: 
            throw Error(`Database "${dbName}" is not defined`)
    }
}

module.exports = {
    Upsert,
    Find,
    FindById,
}