const chai = require('chai')
  , chaiHttp = require('chai-http')
  , StartServer = require('../../Server')
  , {expect} = chai

chai.use(chaiHttp)

before( async () => { server = await StartServer() })

beforeEach( () => { Driver = chai.request("http://localhost:8000").post('/').set("content-type", "application/json") })

after( () => { server.stop() })

describe('🧪 - User stuff', async _ => {
  it('Should fail because sign-up requires email', async () => {
    const CREATE_USER1 = `mutation {
        CreateUser(password:"wtvs") {
          User {
            email
          }
        }
      }`
    const res = await Driver.send({query: CREATE_USER1}).then( res => res.body)
    expect(res.data).to.be.undefined
    expect(res.errors).to.be.an('array')
    expect(res.errors[0].message).to.contain(`argument "email" of type "String!" is required, but it was not provided`)
  })

  it('Should fail because sign-up requires password', async () => {
    const CREATE_USER2 = `mutation{
        CreateUser(email:"jon") {
          User {
            email
          }
        }
    }`
    const res = await Driver.send({query: CREATE_USER2}).then( res => res.body)
    expect(res.data).to.be.undefined
    expect(res.errors).to.be.an('array')
    expect(res.errors[0].message).to.contain(`argument "password" of type "String!" is required, but it was not provided`)
  })

  let NewUser = {}
  it('Should sign-up user properly & provide token', async () => {
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

  it('Should login after sign-up user properly', async () => {
    const LOGIN = `query{
        Login(email: "jondoe@mail.com",password:"test") {
          User {
            id
            email
            username
          }
          token
        }
    }`
    const res = await Driver.send({query: LOGIN}).then( res => res.body)
    expect(res.data.Login.User).to.be.a('object')
    expect(res.data.Login.User.id).to.be.not.null
    expect(res.data.Login.token).to.not.be.null
    expect(res.data.Login.User.email).to.equal('jondoe@mail.com')
    NewUser = res.data.Login.User
    NewUser.token = res.data.Login.token
  })
  
  it('Should fail login after sign-up user properly given wrong password', async () => {
    const LOGIN = `query{
        Login(email: "jondoe@mail.com",password:"tests") {
          User {
            id
            email
            username
          }
          token
        }
    }`
    const res = await Driver.send({query: LOGIN}).then( res => res.body)
    expect(res.data.Login).to.be.null
    expect(res.errors).to.be.an('array')
    expect(res.errors[0].message).to.contain(`Bad credentials`)
  })

  it('Should login user properly & provide new token', async () => {
    const LOGIN_NEW_TOKEN = `query {
      LoginWithToken {
          User {
            id
            email
            username
            fullname
          }
          token
        }
    }`
    const res = await Driver.send({query: LOGIN_NEW_TOKEN}).set("token",NewUser.token).then( res => res.body)
    expect(res.data.LoginWithToken.User).to.be.a('object')
    expect(res.data.LoginWithToken.User.id).to.be.not.null
    expect(res.data.LoginWithToken.token).to.not.be.null
    expect(res.data.LoginWithToken.token).to.not.be.equal(NewUser.token)
    expect(res.data.LoginWithToken.User.email).to.equal('jondoe@mail.com')
    expect(res.data.LoginWithToken.User.username).to.equal('jon')
    expect(res.data.LoginWithToken.User.fullname).to.equal('jondoe')
    NewUser = res.data.LoginWithToken.User
    NewUser.token = res.data.LoginWithToken.token
  })

  it('Should fail because of duplicate users', async () => {
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
    expect(res.errors).to.be.an('array')
    expect(res.errors[0].message).to.contain(`duplicate key error dup key`)
  })

  it('Should find user by id', async () => {
    const FETCH_USER = `query{
        User(id:"${NewUser.id}") {
          id
          email
          username
          fullname
        }
    }`
    const res = await Driver.send({query: FETCH_USER}).then( res => res.body)
    expect(res.data.User).to.be.a('object')
    expect(res.data.User.id).to.be.not.null
    expect(res.data.User.email).to.equal('jondoe@mail.com')
    expect(res.data.User.username).to.equal('jon')
    expect(res.data.User.fullname).to.equal('jondoe')
  })

  it('Should update user info using personal token', async () => {
    const UPDATE_USER = `mutation{
        UpdateProfile(username:"newname") {
          username
        }
    }`
    const res = await Driver.send({query: UPDATE_USER}).set("token",NewUser.token).then( res => res.body)
    expect(res.data.UpdateProfile).to.be.a('object').which.has.property('username')
    expect(res.data.UpdateProfile.username).to.equal('newname')
  })

  it('Should fail update user info using WRONG personal token', async () => {
    const UPDATE_USER = `mutation{
        UpdateProfile(username:"newname") {
          username
        }
    }`
    const res = await Driver.send({query: UPDATE_USER}).set("token",`${NewUser.token}-XXXXX`).then( res => res.body)
    expect(res).to.not.have.property('data')
    expect(res.errors).to.be.an('array')
    expect(res.errors[0].message).to.contain(`invalid signature`)
  })

  it('Should fail update user info using WRONG personal token', async () => {
    const UPDATE_USER = `mutation{
        UpdateProfile(username:"newname") {
          username
        }
    }`
    const res = await Driver.send({query: UPDATE_USER}).then( res => res.body)
    expect(res).to.have.property('data')
              .which.has.property('UpdateProfile')
              .which.is.null
  })

})
