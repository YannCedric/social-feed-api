const express = require('express') 
    , bodyParser = require('body-parser')
    , graphqlHTTP = require('express-graphql')
    , {argv} = require('yargs')
    , { p = 8000, port = p } = argv
    , cors = require('cors')
    , app = express()

const {schema} = require('./graphql')

app.use(cors())
app.use(bodyParser.json())

app.use('/graphql', graphqlHTTP(req => ({
    schema,
    graphiql: true,
    context: {
        ...req,
    }
    })    
)) 

app.get('/health', (req, res)=> res.send('healthy'))

module.exports.app = app.listen(port, _ => console.log(`Server started on port ${port}`))

// const https = require('https');
// const options = {
//   cert: fs.readFileSync('./certs/fullchain.pem'),
//   key: fs.readFileSync('./certs/privkey.pem')
// };
// https.createServer(options,app).listen(port, _ => console.log(`Server started on port ${port}`));
