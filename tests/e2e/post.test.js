describe('🧪 - Post Scenarios', async _ => {
    before( async () => {
        let localDriver = chai.request("http://localhost:8000").post('/').set("content-type", "application/json") 
        
        const CREATE_USER = `mutation{
            CreateUser(email: "jondo0@mail.com",password:"test",username:"jonn",fullname:"jondoe") {
              User {
                id
                email
                username
                fullname
              }
              token
            }
            U2: CreateUser(email: "jondoe22@mail.com",password:"test",username:"jonn22",fullname:"jondoe22") {
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
        expect(res.data.CreateUser.User).to.be.a('object')
        User = res.data.CreateUser.User
        User.token = res.data.CreateUser.token

        User2 = res.data.U2.User
        User2.token = res.data.U2.token
    })

    it('Should fail creating a post, due to missing token', async () => {
        const CREATE_POST = `mutation {
            CreatePost(tags: ["tag1", "tag2"]){
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
            CreatePost(text:"Some text", tags: ["tag1", "tag2"]){
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
            CreatePost(text:"Some text", tags: ["tag1", "tag2"]){
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
        expect(res.data).to.have.property("CreatePost").which.is.not.null
        expect(res.data.CreatePost).to.have.property("id").which.is.not.null
        expect(res.data.CreatePost).to.have.property("text").which.equals("Some text")
        expect(res.data.CreatePost).to.have.property("author").which.is.not.null
        expect(res.data.CreatePost.author).to.have.property("email").which.equals(User.email)
        Post = res.data.CreatePost
    })

    it('Should edit post successfully with right token', async () => {
        const EDIT_POST = `mutation {
            UpdatePost(id: "${Post.id}",text:"Some other text", tags: ["tag1", "tag2"]){
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
        expect(res.data).to.have.property("UpdatePost").which.is.not.null
        expect(res.data.UpdatePost).to.have.property("id").which.is.not.null
        expect(res.data.UpdatePost).to.have.property("text").which.equals("Some other text")
    })

    it('Should fail updating a post, due to expired token', async () => {
        const CREATE_POST = `mutation {
            CreatePost(text:"Some text", tags: ["tag1", "tag2"]){
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
            LikePost(id: "${Post.id}"){
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
        expect(res).to.have.property("data").which.has.property("LikePost")
        expect(res.data.LikePost).to.have.property("likers")
                                .which.includes.something
                                .that.deep.equals({email: User.email})

        expect(res.data.LikePost).to.have.property("dislikers")
                                .which.does.not.includes.something
                                .that.deep.equals({email: User.email})
        
        Post = res.data.LikePost
    })

    it('Should successfully dislike a post', async () => {
        const DISLIKE_POST = `mutation {
            DislikePost(id: "${Post.id}"){
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
        expect(res).to.have.property("data").which.has.property("DislikePost")
        expect(res.data.DislikePost).to.have.property("dislikers")
                                .which.includes.something
                                .that.deep.equals({email: User.email})

        expect(res.data.DislikePost).to.have.property("likers")
                                .which.does.not.includes.something
                                .that.deep.equals({email: User.email})
        
        Post = res.data.DislikePost
    })

    it('Should fail at deleting a post', async () => {
        const DELETE_POST = `mutation {
            DeletePost(id: "${Post.id}"){
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
            DeletePost(id: "${Post.id}"){
                id
            }
        }`
        const res = await driver.send({query: DELETE_POST}).set("token", User.token).then( res => res.body)
        expect(res).to.not.have.property("errors")
        expect(res).to.have.property("data").which.has.property("DeletePost") 
                                            .which.has.property("id")
                                            .which.equals(Post.id)
    })

})