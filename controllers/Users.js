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
        const User = await Create('users',user)
        const token = this.ProvideToken({bearerId: User.id})
        return {User,token}
    }
    static async IssueNewUserToken(id) {
        const User = await this.FindUserById(id)
        const token = this.ProvideToken({bearerId: User.id})
        return {User,token}
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
            let {payload:{bearerId}} = jwt.verify(req.headers.token,TOKEN_SECRET)
            return bearerId
        }
    }
    static async ProvideToken(payload){
       return jwt.sign({payload, timestamp: Date.now()}, TOKEN_SECRET, {expiresIn:TOKEN_EXPIRY})
    }
}

module.exports = Users