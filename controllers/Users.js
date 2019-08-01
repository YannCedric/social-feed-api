const jwt = require('jsonwebtoken')

const {
    Find,
    FindWithPaging,
    FindById,
    Update,
    FindAllByIds,
    Create, 
} = require('../db')

const TOKEN_SECRET = "weak-a-secret"
const TOKEN_EXPIRY = "24h"

const PASSWORDS_SECRET = "weak-a-secret"
const SALT_ROUNDS = 11

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
    static async Authenticate(req){
        if(req && req.headers && req.headers.token) {
            let {bearerId} = jwt.verify(req.headers.token)
            return bearerId
        }
    }
    static async ProvideToken(payload){
       return jwt.sign({payload}, TOKEN_SECRET, {expiresIn:TOKEN_EXPIRY})
    }
}

module.exports = Users