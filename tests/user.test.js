const {TestSetup} = require('./setup')
const {expect} = require('chai')

describe('🧪 - CreateUser', async _ => {
  it('- Create require email field', async () => {
    const { query, mutate }  = await TestSetup()
    const CREATE_USER = `mutation{
        CreateUser(username:"jon",fullname:"jondoe") {
          id
          email
          username
          fullname
        }
    }`
    const res = await mutate( {mutation: CREATE_USER} )
    expect(res.data).to.be.undefined
    expect(res.errors[0].message).to.contain(`argument "email" of type "String!" is required, but it was not provided`)
  })

  it('- Create require username field', async () => {
    const { query, mutate }  = await TestSetup()
    const CREATE_USER = `mutation{
        CreateUser(email:"jon",fullname:"jondoe") {
          id
          email
          username
          fullname
        }
    }`
    const res = await mutate( {mutation: CREATE_USER} )
    expect(res.data).to.be.undefined
    expect(res.errors[0].message).to.contain(`argument "username" of type "String!" is required, but it was not provided`)
  })

  let NewUser = {}
  it('- Create user properly with fields', async () => {
    const { query, mutate }  = await TestSetup()
    const CREATE_USER = `mutation{
        CreateUser(email: "jondoe@mail.com",username:"jon",fullname:"jondoe") {
          id
          email
          username
          fullname
        }
    }`
    const res = await mutate( {mutation: CREATE_USER} )

    expect(res.data.CreateUser).to.be.a('object')
    expect(res.data.CreateUser.id).to.be.not.null
    expect(res.data.CreateUser.email).to.equal('jondoe@mail.com')
    expect(res.data.CreateUser.username).to.equal('jon')
    expect(res.data.CreateUser.fullname).to.equal('jondoe')
    NewUser = res.data.CreateUser
  })

  it('- Find user', async () => {
    const { query, mutate }  = await TestSetup({logs: true})
    const FETCH_USER = `query{
        User(id:"${NewUser.id}") {
          id
          email
          username
          fullname
        }
    }`
    const res = await query( {query: FETCH_USER} )
    expect(res.data.User).to.be.a('object')
    expect(res.data.User.id).to.be.not.null
    expect(res.data.User.email).to.equal('jondoe@mail.com')
    expect(res.data.User.username).to.equal('jon')
    expect(res.data.User.fullname).to.equal('jondoe')
  })

  it('- Update (username)', async () => {
    const { query, mutate }  = await TestSetup({headers: {bearerid: NewUser.id}})
    const UPDATE_USER = `mutation{
        UpdateUser(id:"${NewUser.id}", username:"newname") {
          username
        }
    }`
    const res = await query( {query: UPDATE_USER} )
    expect(res.data.UpdateUser).to.be.a('object')
    expect(res.data.UpdateUser.username).to.equal('newname')
  })

})
