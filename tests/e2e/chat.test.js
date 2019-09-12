describe('🧪 - Chat Scenarios', async _ => {
    before( async () => {
        let localDriver = chai.request("http://localhost:8000").post('/').set("content-type", "application/json") 
        const CREATE_USER = `mutation{
          U1: CreateUser(email: "jondoe3@mail.com",password:"test",username:"jonn3",fullname:"jondoe3") {
            User {
              id
              email
              username
              fullname
            }
            token
          }
          U2: CreateUser(email: "jondoe4@mail.com",password:"test",username:"jonn4",fullname:"jondoe4") {
              User {
                id
                email
                username
                fullname
              }
              token
            }
      }`
        const res1 = await localDriver.send({query: CREATE_USER}).then( res1 => res1.body)
        
        User = res1.data.U1.User
        User.token = res1.data.U1.token

        User2 = res1.data.U2.User
        User2.token = res1.data.U2.token

    })
    
    it('Should successfully send a message and create a chat room', async () => {
        const CREATE_CHAT_ROOM = `mutation {
          SendDirectMessage(id:"${User2.id}",text:"Hola"){
            id
            title
            participants {
              id
            }
            messages {
              text
              timestamp
              creator {
                id
              }
            }
          }
        }`

        const res =  await driver.send({query: CREATE_CHAT_ROOM}).set("token", User.token).then( res => res.body)
        expect(res).to.have.property("data").which.has.property("SendDirectMessage").which.is.not.null
        expect(res.data.SendDirectMessage).to.have.property("id").which.is.not.null
                                          .and.to.have.property("title").which.equals(`DM-${[User.id, User2.id].sort().join('-')}`)
        expect(res.data.SendDirectMessage).to.have.property("participants")
                                          .which.deep.includes({id: User.id})
                                          .and.which.deep.includes({id: User2.id})
        expect(res.data.SendDirectMessage).to.have.property("messages")
                                          .to.includes.something
                                          .which.deep.equals({text: "Hola", creator: {id: User.id}, "timestamp": "a few seconds ago"})
    })

    it('Should successfully send a message and, without creating a chat room', async () => {
      const CREATE_CHAT_ROOM = `mutation {
        SendDirectMessage(id:"${User2.id}",text:"Hola back"){
          id
          title
          participants {
            id
          }
          messages {
            text
            timestamp
            creator {
              id
            }
          }
        }
      }`

      const res =  await driver.send({query: CREATE_CHAT_ROOM}).set("token", User.token).then( res => res.body)
      expect(res).to.have.property("data").which.has.property("SendDirectMessage").which.is.not.null
      expect(res.data.SendDirectMessage).to.have.property("id").which.is.not.null
                                        .and.to.have.property("title").which.equals(`DM-${[User.id, User2.id].sort().join('-')}`)
      expect(res.data.SendDirectMessage).to.have.property("participants")
                                        .which.deep.includes({id: User.id})
                                        .and.which.deep.includes({id: User2.id})
      expect(res.data.SendDirectMessage).to.have.property("messages")
                                          .to.includes.something
                                          .which.deep.equals({text: "Hola", creator: {id: User.id}, "timestamp": "a few seconds ago"})
      expect(res.data.SendDirectMessage).to.have.property("messages")
                                        .to.includes.something
                                        .which.deep.equals({text: "Hola back", creator: {id: User.id}, "timestamp": "a few seconds ago"})
    })
    
})