const {
    MONGO_ADDRESS='localhost',
    USERNAME='test',
    DB_PASS='test',
    DB_PORT=8080,
    AUTH_DB='admin',
    MONGO_URI=`mongodb://${USERNAME}:${DB_PASS}@${MONGO_ADDRESS}:${DB_PORT}/${AUTH_DB}`
} = process.env

module.exports = {
    MONGO_URI,
}