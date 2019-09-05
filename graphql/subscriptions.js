const {
    UserType,
} = require('./schemas')

const UsersSub = {
    type: UserType,
    subscribe: (_, __, context) => {
        return context.pubsub.asyncIterator(['user'])
    },
}

module.exports = {
    UsersSub,
}