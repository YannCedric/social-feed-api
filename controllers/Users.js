const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {
    Find,
    FindWithPaging,
    FindById,
    Update,
    FindAllByIds,
    Create,
    FindOne,
} = require('../db')

const TOKEN_SECRET = process.env.TOKEN_SECRET || "weak-a-secret"
const TOKEN_EXPIRY = "24h"
const SALT_ROUNDS = 5

class Users {
    static async UserSignUp(user) {
        user.password = bcrypt.hashSync(user.password, SALT_ROUNDS)

        const User = await Create('users', user)
        const token = this.ProvideToken({ bearerId: User.id })
        return { User, token }
    }
    static async UserSignIn({ email, password }) {
        const User = await FindOne('users', { email })

        if (!User || !bcrypt.compareSync(password, User.password))
            throw Error("Bad credentials, wrong email or password.")

        const token = this.ProvideToken({ bearerId: User.id })
        return { User, token }
    }
    static async SignInWithToken(id) {
        const User = await this.FindUserById(id)
        const token = this.ProvideToken({ bearerId: User.id })
        return { User, token }
    }
    static async UpdateUser(data) {
        return Update('users', data)
    }
    static async UserFollow({ followerId, followingId }) {
        let userSource = await Update('users', { id: followerId, $addToSet: { followingIds: followingId } })
        let userTarget = await Update('users', { id: followingId, $addToSet: { followersIds: followerId } })
        return { userSource, userTarget }
    }
    static async UserUnFollow({ unfollowerId, unfollowingId }) {
        let userSource = await Update('users', { id: unfollowerId, $pull: { followingIds: unfollowingId } })
        let userTarget = await Update('users', { id: unfollowingId, $pull: { followersIds: unfollowerId } })
        return { userSource, userTarget }
    }
    static async FindUsers(query) {
        return Find('users', query)
    }
    static async FindUsersWithPaging(from, limit) {
        return FindWithPaging('users', from, limit)
    }
    static async FindUserById(id) {
        return FindById('users', id)
    }
    static async FindAllUsersByIds(ids) {
        return FindAllByIds('users', ids)
    }
    static async Authenticate(req) {
        if (req && req.headers && req.headers.token && req.headers.token != "null") {
            return this.VerifyToken(req.headers.token)
        }
    }
    static async VerifyToken(token) {
        let { payload: { bearerId } } = jwt.verify(token, TOKEN_SECRET)
        const user = await this.FindUserById(bearerId)
        if (!user) throw Error("User doesn't exist")
        return bearerId
    }
    static async ProvideToken(payload) {
        return jwt.sign({ payload, timestamp: Date.now() }, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRY })
    }
}

module.exports = Users