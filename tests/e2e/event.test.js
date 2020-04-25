describe('🧪 - Event scenarios', async _ => {
    before( async () => {
        let localDriver = chai.request("http://localhost:8000").post('/').set("content-type", "application/json") 
        
        const CREATE_USER = `mutation{
            UserSignUp(email: "ced@mail.com",password:"test",username:"jonn",fullname:"cedric") {
              User {
                id
                email
                username
                fullname
              }
              token
            }
            U2: UserSignUp(email: "ced2@mail.com",password:"test",username:"jonn22",fullname:"ced2") {
                User {
                id
                email
                username
                fullname
                }
                token
            }
            U3: UserSignUp(email: "ced3@mail.com",password:"test",username:"jonn22",fullname:"ced3") {
                User {
                id
                email
                username
                fullname
                }
                token
            }
        }`

        const res = await localDriver.send({query: CREATE_USER}).then( res => res.body)
        expect(res.data.UserSignUp.User).to.be.a('object')
        User = res.data.UserSignUp.User
        User.token = res.data.UserSignUp.token

        User2 = res.data.U2.User
        User2.token = res.data.U2.token

        User3 = res.data.U3.User
        User3.token = res.data.U3.token
    })

    it('Should fail to create an event, no creator', async () => {
        const CREATE_EVENT = `mutation {
            EventCreate(name:"test",
              type:"test", 
              description:"test",
              dateFrom:"test",
                timeTo:"test",
                timeFrom:"test",
              level:"beginner"
            ){
              id
              name
              creator {
                username
              }
              participants {
                id
              }
            }
          }`
          
        const res = await driver.send({query: CREATE_EVENT}).then( res => res.body)
        expect(res).to.have.property("errors")
        expect(res.errors[0]).to.have.property("message").which.equals('Events validation failed: creatorId: Path `creatorId` is required.')
    })

    it('Should fail to create an event, missing tyle fields', async () => {
        const CREATE_EVENT = `mutation {
            EventCreate(name: "test"){
              id
              name
              creator {
                username
              }
              participants {
                id
              }
            }
          }`
          
        const res = await driver.send({query: CREATE_EVENT}).then( res => res.body)
        expect(res).to.have.property("errors")
        expect(res.errors[0]).to.have.property("message").which.includes('argument "type" of type "String!" is required')
    })

    it('Should create an event', async () => {
        const CREATE_EVENT = `mutation {
            EventCreate(name:"test",
              type:"test", 
              description:"test",
              dateFrom:"test",
              timeTo:"test",
              timeFrom:"test",
              level:"beginner"
            ){
              id
              name
              creator {
                username
              }
              participants {
                id
              }
            }
          }`
          
        const res = await driver.send({query: CREATE_EVENT}).set("token", User.token).then( res => res.body)
        expect(res).to.have.property("data").which.has.property("EventCreate")
                                            .which.has.property("creator")
                                            .which.has.property("username")
                                            .which.equals(User.username)
        expect(res.data.EventCreate).to.have.property("participants")
                                .which.includes.something
                                .that.deep.equals({id: User.id})

        eventId = res.data.EventCreate.id
    })

    it('Should join an event', async () => {
        const JOIN_EVENT = `mutation {
            EventJoin(id:"${eventId}"){
              id
              name
              creator {
                username
              }
              participants {
                id
              }
            }
          }`
          
        const res = await driver.send({query: JOIN_EVENT}).set("token", User2.token).then( res => res.body)
        expect(res).to.have.property("data").which.has.property("EventJoin")
                                            .which.has.property("creator")
                                            .which.has.property("username")
                                            .which.equals(User.username)
        expect(res.data.EventJoin).to.have.property("participants")
                                .which.includes.something
                                .that.deep.equals({id: User.id})
                                .and.includes.something.that.deep.equals({id: User2.id})
    })

    it('Should retrieve events a user joined', async () => {
        const GET_USER_EVENTS = `query {
            User(id:"${User2.id}"){
                eventsJoined {
                    id
                    creator {
                        username
                    }
              }
            }
          }`
          
        const res = await driver.send({query: GET_USER_EVENTS}).set("token", User2.token).then( res => res.body)
        expect(res).to.have.property("data").to.have.property("User").which.has.property("eventsJoined")
        expect(res.data.User.eventsJoined).which.includes.something
                                          .that.deep.equals({id: eventId, creator: { username: User.username }})
    })

    it('Should remove user from events list joined', async () => {
        const LEAVE_EVENT = `mutation {
            EventLeave(id:"${eventId}"){
              participants {
                username
              }
            }
          }`
          
        const res = await driver.send({query: LEAVE_EVENT}).set("token", User2.token).then( res => res.body)
        expect(res).to.have.property("data").to.have.property("EventLeave").which.has.property("participants")
        expect(res.data.EventLeave.participants).which.does.not.includes.something
                                                .that.deep.equals({id: eventId})
    })
})