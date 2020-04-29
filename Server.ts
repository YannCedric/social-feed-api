const { argv } = require('yargs')
  , logger = require('./logger')
  , { ApolloServer } = require('apollo-server')
  , { PubSub } = require('graphql-subscriptions')
  , { MongoMemoryServer } = require('mongodb-memory-server')
  , { p = 8000, port = p, local = false, log_level = "trace" } = argv
  , pubsub = new PubSub()

module.exports = async function StartServer() {
  await Setup() // Sets up MONGO_URI process env, so that the schema imports can use it

  const { schema } = require('./graphql')
  const UsersController = require('./controllers/Users')

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => ({
      headers: req ? req.headers : null, // for subscriptions errors
      pubsub,
      bearerId: await UsersController.Authenticate(req),
    })
  });

  server.listen(port).then(({ url }) => {
    logger.info(`🚀 - Server ready at ${url}`);
  });

  return server;
}

async function Setup() {
  logger.level = log_level
  logger.info("Log level set to: " + log_level)

  if (local) {

    const mongod = new MongoMemoryServer() // create local db
    process.env.MONGO_URI = await mongod.getConnectionString() // overide global db uri
    logger.info("Using in memory (ephemeral) database")
  }

}