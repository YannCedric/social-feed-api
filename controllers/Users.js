const {
    Find,
    FindById,
    Upsert,
    FindAllByIds,
} = require('../db')

class Users {
    static async CreateUser(user) {
        return Upsert('users',user)
    }
    static async FindUsers(query){
        return Find('users',query)
    }
    static async FindUserById(id){
        return FindById('users',id)
    }
    static async FindAllUsersByIds(ids){
        return FindAllByIds('users',ids)
    }
}

module.exports = Users