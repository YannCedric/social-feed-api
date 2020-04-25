describe('🧪 - User Scenarios', async _ => {
  it('Should fail because sign-up requires email', async () => {
    const CREATE_USER1 = `mutation {
        UserSignUp(password:"wtvs") {
          User {
            email
          }
        }
      }`
    const res = await driver.send({query: CREATE_USER1}).then( res => res.body)
    expect(res.data).to.be.undefined
    expect(res.errors).to.be.an('array')
    expect(res.errors[0].message).to.contain(`argument "email" of type "String!" is required, but it was not provided`)
  })

  it('Should fail because sign-up requires password', async () => {
    const CREATE_USER2 = `mutation{
        UserSignUp(email:"jon") {
          User {
            email
          }
        }
    }`
    const res = await driver.send({query: CREATE_USER2}).then( res => res.body)
    expect(res.data).to.be.undefined
    expect(res.errors).to.be.an('array')
    expect(res.errors[0].message).to.contain(`argument "password" of type "String!" is required, but it was not provided`)
  })

  let NewUser = {}
  it('Should sign-up user properly & provide token', async () => {
    const CREATE_USER = `mutation{
        UserSignUp(email: "jondoe@mail.com",password:"test",username:"jon",fullname:"jondoe") {
          User {
            id
            email
            username
            fullname
          }
          token
        }
    }`
    const res = await driver.send({query: CREATE_USER}).then( res => res.body)
    expect(res.data.UserSignUp.User).to.be.a('object')
    expect(res.data.UserSignUp.User.id).to.be.not.null
    expect(res.data.UserSignUp.token).to.not.be.null
    expect(res.data.UserSignUp.User.email).to.equal('jondoe@mail.com')
    expect(res.data.UserSignUp.User.username).to.equal('jon')
    expect(res.data.UserSignUp.User.fullname).to.equal('jondoe')
    NewUser = res.data.UserSignUp.User
    NewUser.token = res.data.UserSignUp.token
  })

  it('Should login after sign-up user properly', async () => {
    const LOGIN = `query{
        UserSignin(email: "jondoe@mail.com",password:"test") {
          User {
            id
            email
            username
          }
          token
        }
    }`
    const res = await driver.send({query: LOGIN}).then( res => res.body)
    expect(res.data.UserSignin.User).to.be.a('object')
    expect(res.data.UserSignin.User.id).to.be.not.null
    expect(res.data.UserSignin.token).to.not.be.null
    expect(res.data.UserSignin.User.email).to.equal('jondoe@mail.com')
    NewUser = res.data.UserSignin.User
    NewUser.token = res.data.UserSignin.token
  })
  
  it('Should fail login after sign-up user properly given wrong password', async () => {
    const LOGIN = `query{
        UserSignin(email: "jondoe@mail.com",password:"tests") {
          User {
            id
            email
            username
          }
          token
        }
    }`
    const res = await driver.send({query: LOGIN}).then( res => res.body)
    expect(res.data.UserSignin).to.be.null
    expect(res.errors).to.be.an('array')
    expect(res.errors[0].message).to.contain(`Bad credentials`)
  })

  it('Should login user properly & provide new token', async () => {
    const LOGIN_NEW_TOKEN = `query {
      UserSigninWithToken {
          User {
            id
            email
            username
            fullname
          }
          token
        }
    }`
    const res = await driver.send({query: LOGIN_NEW_TOKEN}).set("token",NewUser.token).then( res => res.body)
    expect(res.data.UserSigninWithToken.User).to.be.a('object')
    expect(res.data.UserSigninWithToken.User.id).to.be.not.null
    expect(res.data.UserSigninWithToken.token).to.not.be.null
    expect(res.data.UserSigninWithToken.token).to.not.be.equal(NewUser.token)
    expect(res.data.UserSigninWithToken.User.email).to.equal('jondoe@mail.com')
    expect(res.data.UserSigninWithToken.User.username).to.equal('jon')
    expect(res.data.UserSigninWithToken.User.fullname).to.equal('jondoe')
    NewUser = res.data.UserSigninWithToken.User
    NewUser.token = res.data.UserSigninWithToken.token
  })

  it('Should fail because of duplicate users', async () => {
    const CREATE_USER = `mutation{
        User1: UserSignUp(email: "jondoe-dup@mail.com",password:"test",username:"jon-dup",fullname:"jondoe") {
          User {
            id
            username
          }
        }
        User2: UserSignUp(email: "jondoe-dup@mail.com",password:"test",username:"jon-dup",fullname:"jondoe") {
          User {
            id
          }
        }
    }`
    const res = await driver.send({query: CREATE_USER}).then( res => res.body)
    
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
    const res = await driver.send({query: FETCH_USER}).then( res => res.body)
    expect(res.data.User).to.be.a('object')
    expect(res.data.User.id).to.be.not.null
    expect(res.data.User.email).to.equal('jondoe@mail.com')
    expect(res.data.User.username).to.equal('jon')
    expect(res.data.User.fullname).to.equal('jondoe')
  })

  it('Should update user info using personal token', async () => {
    const UPDATE_USER = `mutation{
        UserUpdate(username:"newname") {
          username
        }
    }`
    const res = await driver.send({query: UPDATE_USER}).set("token",NewUser.token).then( res => res.body)
    expect(res.data.UserUpdate).to.be.a('object').which.has.property('username')
    expect(res.data.UserUpdate.username).to.equal('newname')
  })

  it('Should fail update user info using invalid personal token', async () => {
    const UPDATE_USER = `mutation{
        UserUpdate(username:"newname") {
          username
        }
    }`
    const res = await driver.send({query: UPDATE_USER}).set("token",`${NewUser.token}-XXXXX`).then( res => res.body)
    expect(res).to.not.have.property('data')
    expect(res.errors).to.be.an('array')
    expect(res.errors[0].message).to.contain(`invalid signature`)
  })

  it('Should fail update user info using no personal token', async () => {
    const UPDATE_USER = `mutation{
        UserUpdate(username:"newname") {
          username
        }
    }`
    const res = await driver.send({query: UPDATE_USER}).then( res => res.body)
    expect(res).to.have.property('data')
              .which.has.property('UserUpdate')
              .which.is.null
  })

})
