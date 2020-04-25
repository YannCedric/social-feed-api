describe('🧪 - Post Scenarios', async _ => {
    before( async () => {
        let localDriver = chai.request("http://localhost:8000").post('/').set("content-type", "application/json") 
        
        const CREATE_USER = `mutation{
            UserSignUp(email: "jondo0@mail.com",password:"test",username:"jonn",fullname:"jondoe") {
              User {
                id
                email
                username
                fullname
              }
              token
            }
            U2: UserSignUp(email: "jondoe22@mail.com",password:"test",username:"jonn22",fullname:"jondoe22") {
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
    })

    it('Should fail creating a post, due to missing token', async () => {
        const CREATE_POST = `mutation {
            PostCreate(tags: ["tag1", "tag2"]){
                id
                text
                tags
                author {
                    email
                }
            }
        }`
        const res = await driver.send({query: CREATE_POST}).set("token", User.token).then( res => res.body)
        expect(res).to.have.property('errors').which.is.not.null
        expect(res.errors[0].message).to.contain(`"text" of type "String!" is required,`)
    })

    it('Should fail creating a post, due to missing text', async () => {
        const CREATE_POST = `mutation {
            PostCreate(text:"Some text", tags: ["tag1", "tag2"]){
                id
                text
                tags
                author {
                    email
                }
            }
        }`
        const res = await driver.send({query: CREATE_POST}).then( res => res.body)
        expect(res).to.have.property('errors').which.is.not.null
        expect(res.errors[0].message).to.contain(`Posts validation failed: authorId`)
    })

    let Post = {}
    it('Should create post successfully', async () => {
        const CREATE_POST = `mutation {
            PostCreate(text:"Some text", tags: ["tag1", "tag2"]){
                id
                text
                tags
                author {
                    email
                }
            }
        }`
        const res = await driver.send({query: CREATE_POST}).set("token", User.token).then( res => res.body)
        expect(res.data).to.not.be.null
        expect(res.data).to.have.property("PostCreate").which.is.not.null
        expect(res.data.PostCreate).to.have.property("id").which.is.not.null
        expect(res.data.PostCreate).to.have.property("text").which.equals("Some text")
        expect(res.data.PostCreate).to.have.property("author").which.is.not.null
        expect(res.data.PostCreate.author).to.have.property("email").which.equals(User.email)
        Post = res.data.PostCreate
    })

    it('Should edit post successfully with right token', async () => {
        const EDIT_POST = `mutation {
            PostUpdate(id: "${Post.id}",text:"Some other text", tags: ["tag1", "tag2"]){
                id
                text
                tags
                author {
                    email
                }
            }
        }`
        const res = await driver.send({query: EDIT_POST}).set("token", User.token).then( res => res.body)
        expect(res.data).to.not.be.null
        expect(res.data).to.have.property("PostUpdate").which.is.not.null
        expect(res.data.PostUpdate).to.have.property("id").which.is.not.null
        expect(res.data.PostUpdate).to.have.property("text").which.equals("Some other text")
    })

    it('Should fail updating a post, due to expired token', async () => {
        const CREATE_POST = `mutation {
            PostCreate(text:"Some text", tags: ["tag1", "tag2"]){
                id
                text
                tags
                author {
                    email
                }
            }
        }`
        const res = await driver.send({query: CREATE_POST})
                                .set("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImJlYXJlcklkIjoiNWQ1NjFhM2NiMGQ1OGVhM2MwMjRhNzVlIn0sInRpbWVzdGFtcCI6MTU2NTkyMzkwMDc3MiwiaWF0IjoxNTY1OTIzOTAwLCJleHAiOjE1NjYwMTAzMDB9.oEMwjZkAeljQ18FMiFQLxdOhJGOIHHp2-vVCzPeNss0")
                                .then( res => res.body)
        expect(res).to.have.property('errors').which.is.not.null
        expect(res.errors[0].message).to.contain(`jwt expired`)
    })

    it('Should successfully like a post', async () => {
        const LIKE_POST = `mutation {
            PostLike(id: "${Post.id}"){
                id
                text
                tags
                likers {
                    email
                }
                dislikers {
                    email
                }
            }
        }`
        const res = await driver.send({query: LIKE_POST}).set("token", User.token).then( res => res.body)
        expect(res).to.have.property("data").which.has.property("PostLike")
        expect(res.data.PostLike).to.have.property("likers")
                                .which.includes.something
                                .that.deep.equals({email: User.email})

        expect(res.data.PostLike).to.have.property("dislikers")
                                .which.does.not.includes.something
                                .that.deep.equals({email: User.email})
        
        Post = res.data.PostLike
    })

    it('Should successfully dislike a post', async () => {
        const DISLIKE_POST = `mutation {
            PostDislike(id: "${Post.id}"){
                id
                text
                tags
                likers {
                    email
                }
                dislikers {
                    email
                }
            }
        }`
        const res = await driver.send({query: DISLIKE_POST}).set("token", User.token).then( res => res.body)
        expect(res).to.have.property("data").which.has.property("PostDislike")
        expect(res.data.PostDislike).to.have.property("dislikers")
                                .which.includes.something
                                .that.deep.equals({email: User.email})

        expect(res.data.PostDislike).to.have.property("likers")
                                .which.does.not.includes.something
                                .that.deep.equals({email: User.email})
        
        Post = res.data.PostDislike
    })

    it('Should fail at deleting a post', async () => {
        const DELETE_POST = `mutation {
            PostDelete(id: "${Post.id}"){
                id
            }
        }`
        const res = await driver.send({query: DELETE_POST}).set("token", User2.token).then( res => res.body)
        expect(res).to.have.property("errors")
                   .which.includes.something
                   .that.has.property("message")
        expect(res.errors[0].message).to.equal("User doesn't have the right to delete this post.")
    })

    it('Should successfully delete a post', async () => {
        const DELETE_POST = `mutation {
            PostDelete(id: "${Post.id}"){
                id
            }
        }`
        const res = await driver.send({query: DELETE_POST}).set("token", User.token).then( res => res.body)
        expect(res).to.not.have.property("errors")
        expect(res).to.have.property("data").which.has.property("PostDelete") 
                                            .which.has.property("id")
                                            .which.equals(Post.id)
    })


  
  it('Should follow user', async () => {
    const FOLLOW_USER = `mutation{
        UserFollow(id:"${User2.id}") {
          userSource {
              username
              following {
                  username
              }
            }
          userTarget {
              username
              followers {
                  username
              }
            }
        }
    }`
    const res = await driver.send({query: FOLLOW_USER}).set("token",`${User.token}`).then( res => res.body)
    expect(res).to.have.property('data').which.has.property("UserFollow").which.has.property("userSource")
    expect(res).to.have.property('data').which.has.property("UserFollow").which.has.property("userSource")
    expect(res.data.UserFollow.userSource.following).to.include.something.that.deep.equals({username: User2.username})
    expect(res.data.UserFollow.userTarget.followers).to.include.something.that.deep.equals({username: User.username})
    })

    it('Should unfollow user', async () => {
        const FOLLOW_USER = `mutation{
            UserUnFollow(id:"${User2.id}") {
              userSource {
                  username
                  following {
                      username
                  }
                }
              userTarget {
                  username
                  followers {
                      username
                  }
                }
            }
        }`
        const res = await driver.send({query: FOLLOW_USER}).set("token",`${User.token}`).then( res => res.body)
        expect(res).to.have.property('data').which.has.property("UserUnFollow").which.has.property("userSource")
        expect(res).to.have.property('data').which.has.property("UserUnFollow").which.has.property("userSource")
        expect(res.data.UserUnFollow.userSource.following).to.not.include.something.that.deep.equals({username: User2.username})
        expect(res.data.UserUnFollow.userTarget.followers).to.not.include.something.that.deep.equals({username: User.username})
        })
})