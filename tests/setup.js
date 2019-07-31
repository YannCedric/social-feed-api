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
    console.log = _ => {}

    const { createTestClient } = require('apollo-server-testing')
    const {server} = require('../index')
    
    server.context = _ => ({ // Stub context
      headers, 
      pubsub: {
        publish: (event, arg) => console.log(`publishing ${JSON.stringify(arg)} in channel "${event}"`)
      }
    })
    
    let { query, mutate } = createTestClient(server)
    const wrapper = operation => async args => {
            const response = await operation(args)
            server.stop()
            return response
          }

    return { query: wrapper(query), mutate: wrapper(mutate) }
}