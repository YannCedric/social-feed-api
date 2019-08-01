process.env.LOG_LEVEL = "off"

const {expect} = require('chai')
const {envSetup, createUsers} = require('./helpers')

let Mutate, Query, Server; // Shared variables

before( async () => {
  const {query, mutate, server} = await envSetup()

  Mutate = mutate;
  Query = query;
  Server = server;

  // const {User1, User2, User3} = await createUsers(3, mutate)
  // console.log({User1, User2, User3})
})

after( () => {
  if(Server) Server.stop()
})

describe('🧪 - CreateUser', async _ => {
  it('- Create require email field', async () => {
    const CREATE_USER = `mutation{
        CreateUser(username:"jon",fullname:"jondoe") {
          id
          email
          username
          fullname
        }
    }`
    const res = await Mutate( {mutation: CREATE_USER} )
    expect(res.data).to.be.undefined
    expect(res.errors[0].message).to.contain(`argument "email" of type "String!" is required, but it was not provided`)
  })

  it('- Create require username field', async () => {
    const CREATE_USER = `mutation{
        CreateUser(email:"jon",fullname:"jondoe") {
          id
          email
          username
          fullname
        }
    }`
    const res = await Mutate( {mutation: CREATE_USER} )
    expect(res.data).to.be.undefined
    expect(res.errors[0].message).to.contain(`argument "username" of type "String!" is required, but it was not provided`)
  })

  let NewUser = {}
  it('- Create user properly with fields', async () => {
    Server.context = _ => ({headers: "meet"}) // pass some headers this way
    
    const CREATE_USER = `mutation{
        CreateUser(email: "jondoe@mail.com",username:"jon",fullname:"jondoe") {
          id
          email
          username
          fullname
        }
    }`
    const res = await Mutate( {mutation: CREATE_USER} )

    expect(res.data.CreateUser).to.be.a('object')
    expect(res.data.CreateUser.id).to.be.not.null
    expect(res.data.CreateUser.email).to.equal('jondoe@mail.com')
    expect(res.data.CreateUser.username).to.equal('jon')
    expect(res.data.CreateUser.fullname).to.equal('jondoe')
    NewUser = res.data.CreateUser
  })

  it('- Find user', async () => {
    const FETCH_USER = `query{
        User(id:"${NewUser.id}") {
          id
          email
          username
          fullname
        }
    }`
    const res = await Query( {query: FETCH_USER} )
    expect(res.data.User).to.be.a('object')
    expect(res.data.User.id).to.be.not.null
    expect(res.data.User.email).to.equal('jondoe@mail.com')
    expect(res.data.User.username).to.equal('jon')
    expect(res.data.User.fullname).to.equal('jondoe')
  })

  it('- Update (username)', async () => {
    const UPDATE_USER = `mutation{
        UpdateUser(id:"${NewUser.id}", username:"newname") {
          username
        }
    }`
    const res = await Query( {query: UPDATE_USER} )
    expect(res.data.UpdateUser).to.be.a('object')
    expect(res.data.UpdateUser.username).to.equal('newname')
  })

})
