const {
    MONGO_ADDRESS='localhost',
    USERNAME='test',
    DB_PASS='test',
    DB_PORT=8080,
    AUTH_DB='admin',
} = process.env

module.exports = {
    MONGO_ADDRESS,
    USERNAME,
    DB_PASS,
    DB_PORT,
    AUTH_DB
}