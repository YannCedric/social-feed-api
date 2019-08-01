const {ApolloServer} = require('apollo-server')
    , {argv} = require('yargs')
    , {PubSub} = require('graphql-subscriptions')
    
    , { p = 8000, port = p } = argv
    , {schema} = require('./graphql')
    , UsersController = require('./controllers/Users')
    , pubsub = new PubSub()
    , logger = require('./logger')

logger.level = process.env.LOG_LEVEL || 'trace'

const server = new ApolloServer({
  schema,
  context: ({req}) => ({
      headers: req ? req.headers : null, // for mutation errors
      pubsub,
      bearerId: UsersController.Authenticate(req),
    })
});

server.listen(port).then(({ url }) => {
  logger.info(`🚀 - Server ready at ${url}`);
});

module.exports = {server}