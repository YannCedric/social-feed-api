module.exports.TestSetup = async function ({headers}={}){
    const {MongoMemoryServer} = require('mongodb-memory-server')
    const mongod = new MongoMemoryServer({
      instance: {
        debug: true,
        port: 8080,
        dbName: 'admin',
      }
    });
    process.env.MONGO_URI = await mongod.getConnectionString()

    const { createTestClient } = require('apollo-server-testing')
    const {server} = require('../index')
    
    server.context = _ => ({ // Stub context
        headers, 
        pubsub: {
          publish: (event, arg) => console.log(`publishing ${JSON.stringify(arg)} in channel "${event}"`)
        }
      })
    
    const { query, mutate } = createTestClient(server)
    return { query, mutate }
}
  