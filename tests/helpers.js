const { createTestClient } = require('apollo-server-testing')
const {MongoMemoryServer} = require('mongodb-memory-server')

module.exports.envSetup = async function () {
    const mongod = new MongoMemoryServer({
        instance: {
          debug: true,
          port: 8080,
          dbName: 'admin',
        }
      }) // create local db
      process.env.MONGO_URI = await mongod.getConnectionString() // overide global db uri
      const {server} = require('../index')
      let { query, mutate } = createTestClient(server)
      return {query, mutate, server}
}

module.exports.createUsers = async function (count=1, mutate){ // Creates the number of required users
  let builder = ''
  for(let i=1; i<= count; i++){
    builder += `
    User${i}: CreateUser(email: "jondoe${i}@mail.com",username:"jond${i}",fullname:"jondoe${i}") {
      id
      email
      username
      fullname
    }
    `
  }

  let CREATE_USER_QUERY = `mutation{
    ${builder}
  }`

  const res = await mutate( {mutation: CREATE_USER_QUERY} )
  return res.data
}

module.exports.withHeaders = function (server, headers){ // Wraps the server and add headers
  const ctx = server.context({})

  const newCtx =  _ => ({...ctx, headers: {...ctx.headers, ...headers}}) 

  server.context = newCtx
  return server;
}