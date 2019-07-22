const {
    Find,
    FindWithPaging,
    FindById,
    Update,
    FindAllByIds,
    Create, 
} = require('../db')

class Users {
    static async CreateUser(user) {
        return Create('users',user)
    }
    static async UpdateUser(data) {
        return Update('users', data)
    }
    static async FindUsers(query){
        return Find('users',query)
    }
    static async FindUsersWithPaging(from, limit){
        return FindWithPaging('users',from, limit)
    }
    static async FindUserById(id){
        return FindById('users',id)
    }
    static async FindAllUsersByIds(ids){
        return FindAllByIds('users',ids)
    }
}

module.exports = Users