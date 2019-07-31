const {TestSetup} = require('./mocking-setup')
const {expect} = require('chai')
describe('CreateUser', _ => {
  it('will return object', async done => {
  
    TestSetup({headers: {key:"val"}})
      .then( async ({ query, mutate }) => {
        const CREATE_USER = `mutation{
            CreateUser(email: "mail",username:"test") {
              id
              username
            }
        }`
        const res = await mutate( {mutation: CREATE_USER} ).catch(done)
        expect(res).to.be.a('object')
        })
    })
})
