const {ApolloServer} = require('apollo-server')
    , {argv} = require('yargs')
    , {PubSub} = require('graphql-subscriptions')
    , { p = 8000, port = p, local=false, log_level="trace" } = argv
    , pubsub = new PubSub()
    , logger = require('./logger')
    , {MongoMemoryServer} = require('mongodb-memory-server')

module.exports = async function StartServer(){
  await Setup()

  const {schema} = require('./graphql')
  const UsersController = require('./controllers/Users')

  const server = new ApolloServer({
    schema,
    context: async ({req}) => ({
      headers: req ? req.headers : null, // for subscriptions errors
      pubsub,
      bearerId: await UsersController.Authenticate(req),
    })
  });
  
  server.listen(port).then(({ url }) => {
    logger.info(`🚀 - Server ready at ${url}`);
  });

  return server;
}

async function Setup(){
  logger.level = log_level
  logger.info("Log level set to: "+log_level)
  
  if(local) {
    const mongod = new MongoMemoryServer() // create local db
    process.env.MONGO_URI = await mongod.getConnectionString() // overide global db uri
    logger.info("Using in memory (ephemeral) database")
  }

}