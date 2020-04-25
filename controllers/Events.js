const {
    Find,
    Update,
    Create,
} = require('../db')

class Events {
    static async EventCreate(event) {
        return Create('events', event)
    }

    static async EventJoin({ id, joinerId }) {
        return Update('events', { id, $push: { participantsIds: joinerId } })
    }
    static async EventLeave({ id, leaverId }) {
        return Update('events', { id, $pull: { participantsIds: leaverId } })
    }

    static async GetUserEvents(id) {
        return Find('events', { participantsIds: id })
    }
}

module.exports = Events