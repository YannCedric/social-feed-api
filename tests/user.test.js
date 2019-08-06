const chai = require('chai')
  , {expect} = chai
  , chaiHttp = require('chai-http')
  , API_ENDPOINT = 'http://localhost:8000'
  , StartServer = require('../Server')
  
chai.use(chaiHttp)

const Driver = chai.request(API_ENDPOINT).post('/').set("content-type", "application/json")

before( async () => {
  await StartServer()
})

describe('🧪 - CreateUser', async _ => {
  it('- Should fail because sign-up requires email', async () => {
    const CREATE_USER = `mutation {
        CreateUser(username:"jon",fullname:"jondoe") {
          User {
            id
            email
            username
            fullname
          }
        }
      }`
    const res = await Driver.send({query: CREATE_USER}).then( res => res.body)
    expect(res.data).to.be.undefined
    expect(res.errors[0].message).to.contain(`argument "email" of type "String!" is required, but it was not provided`)
  })

  it('- Should fail because sign-up requires password', async () => {
    const CREATE_USER = `mutation{
        CreateUser(email:"jon") {
          User {
            id
            email
            username
            fullname
          }
        }
    }`
    const res = await Driver.send({query: CREATE_USER}).then( res => res.body)
    expect(res.data).to.be.undefined
    expect(res.errors[0].message).to.contain(`argument "password" of type "String!" is required, but it was not provided`)
  })

  let NewUser = {}
  it('- Should sign-up user properly', async () => {
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
    const res = await Driver.send({query: CREATE_USER}).then( res => res.body)
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
        User1: CreateUser(email: "jondoe-dup@mail.com",password:"test",username:"jon-dup",fullname:"jondoe") {
          User {
            id
            username
          }
        }
        User2: CreateUser(email: "jondoe-dup@mail.com",password:"test",username:"jon-dup",fullname:"jondoe") {
          User {
            id
          }
        }
    }`
    const res = await Driver.send({query: CREATE_USER}).then( res => res.body)
    
    expect(res.data.User1.User).to.not.be.null
    expect(res.data.User1.User.username).to.be.equal("jon-dup")
    expect(res.data.User2).to.be.null
    expect(res.errors[0].message).to.contain(`duplicate key error dup key`)
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
    const res = await Driver.send({query: CREATE_USER}).then( res => res.body)
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
