before( async () => {
   chai = require('chai')
  , chaiHttp = require('chai-http')
  , StartServer = require('../../Server')
  , chaiThings = require('chai-things')

    chai.use(chaiHttp)
    chai.use(chaiThings)

    server = await StartServer()
    expect = chai.expect
})

beforeEach( () => { 
    driver = chai.request("http://localhost:8000").post('/').set("content-type", "application/json") 
})

after( () => { 
    server.stop() 
})
