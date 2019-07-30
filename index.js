const {ApolloServer} = require('apollo-server')
    , {argv} = require('yargs')
    , {PubSub} = require('graphql-subscriptions')
    
    , { p = 8000, port = p } = argv
    , {schema} = require('./graphql')
    , pubsub = new PubSub()

const server = new ApolloServer({
  schema,
  context: ({req}) => ({
      headers: req ? req.headers : null, // for mutation errors
      pubsub,
    })
});

server.listen(port).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

module.exports = {server}