process.env.LOG_LEVEL = "off"

const {expect} = require('chai')
const {envSetup, createUsers, withHeaders} = require('./helpers')

let Mutate, Query, Server; // Shared variables

beforeEach( async () => {
  const {query, mutate, server} = await envSetup()

  Mutate = mutate;
  Query = query;
  Server = server;
})

afterEach( () => {
  if(Server) Server.stop()
})

describe('🧪 - CreateUser', async _ => {
  it('- Should fail because sign-up require email', async () => {
    const CREATE_USER = `mutation{
        CreateUser(username:"jon",fullname:"jondoe") {
          User {
            id
            email
            username
            fullname
          }
        }
    }`
    const res = await Mutate( {mutation: CREATE_USER} )
    expect(res.data).to.be.undefined
    expect(res.errors[0].message).to.contain(`argument "email" of type "String!" is required, but it was not provided`)
  })

  it('- Should fail because sign-up requires password', async () => {
    const CREATE_USER = `mutation{
        CreateUser(email:"jon",) {
          User {
            id
            email
            username
            fullname
          }
        }
    }`
    const res = await Mutate( {mutation: CREATE_USER} )
    expect(res.data).to.be.undefined
    expect(res.errors[0].message).to.contain(`argument "password" of type "String!" is required, but it was not provided`)
  })

  let NewUser = {}
  it('- Should Sign-up user properly', async () => {
    const CREATE_USER = `mutation{
        CreateUser(email: "jondoe@mail.com",password:"test",username:"jon",fullname:"jondoe") {
          User {
            id
            email
            username
            fullname
          }
          token
        }
    }`
    const res = await Mutate( {mutation: CREATE_USER} )
    expect(res.data.CreateUser.User).to.be.a('object')
    expect(res.data.CreateUser.User.id).to.be.not.null
    expect(res.data.CreateUser.token).to.not.be.null
    expect(res.data.CreateUser.User.email).to.equal('jondoe@mail.com')
    expect(res.data.CreateUser.User.username).to.equal('jon')
    expect(res.data.CreateUser.User.fullname).to.equal('jondoe')
    NewUser = res.data.CreateUser.User
    NewUser.token = res.data.CreateUser.token
  })

  it('- Should fail because of duplicate users', async () => {
    const CREATE_USER = `mutation{
        CreateUser(email: "jondoe-dup@mail.com",password:"test",username:"jon-dup",fullname:"jondoe") {
          User {
            id
            email
            username
            fullname
          }
          token
        }
    }`
    const res1 = await Mutate( {mutation: CREATE_USER} )
    const res2 = await Mutate( {mutation: CREATE_USER} )
    
    expect(res1.data.CreateUser).to.not.be.null
    expect(res2.data.CreateUser).to.be.null
    expect(res2.errors[0].message).to.contain(`E11000 duplicate key error dup key: { : "jondoe-dup@mail.com" }`)
  })

  it('- Should find user by id', async () => {
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

  it('- Should Update user info', async () => {
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
