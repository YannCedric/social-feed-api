describe('🧪 - Comments Scenarios', async _ => {
    before( async () => {
        let localDriver = chai.request("http://localhost:8000").post('/').set("content-type", "application/json") 
        const CREATE_USER = `mutation{
            U1: UserSignUp(email: "jondoee@mail.com",password:"test",username:"jonn",fullname:"jondoe") {
              User {
                id
                email
                username
                fullname
              }
              token
            }
            U2: UserSignUp(email: "jondoe2@mail.com",password:"test",username:"jon2",fullname:"jondoe2") {
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

        let localDriver2 = chai.request("http://localhost:8000").post('/').set("content-type", "application/json") 
        const CREATE_POST = `mutation{
            PostCreate(text:"Some text", tags: ["tag1", "tag2"]){
                id
                text
                tags
                author {
                    email
                }
            }
        }`
        const res2 = await localDriver2.send({query: CREATE_POST}).set("token", User.token).then( res2 => res2.body)
        Post = res2.data.PostCreate
    })

    it('Should successfully make a comment', async () => {
        const MAKE_COMMENT = `mutation {
            CommentCreate(postId: "${Post.id}", text: "Some comment"){
                id
                text
                post {
                    id
                }
                author {
                    email
                }
            }
        }`
        const res = await driver.send({query: MAKE_COMMENT}).set("token", User.token).then( res => res.body)
        expect(res).to.have.property("data").which.has.property("CommentCreate").which.is.not.null
        expect(res.data.CommentCreate).to.have.property("post")
                                .which.has.property("id")
                                .which.equals(Post.id)

        expect(res.data.CommentCreate).to.have.property("author")
                                .which.has.property("email")
                                .which.equals(User.email)
        Comment = res.data.CommentCreate
    })

    it('Should fail at editing a comment, not the creator', async () => {
        const EDIT_COMMENT = `mutation {
            CommentUpdate(id: "${Comment.id}", text: "Some other comment from user 2"){
                id
                text
                post {
                    id
                }
                author {
                    email
                }
            }
        }`
        const res = await driver.send({query: EDIT_COMMENT}).set("token", User2.token).then( res => res.body)
        expect(res).to.have.property("errors")
                   .which.includes.something
                   .that.has.property("message")
        expect(res.errors[0].message).to.equal("User doesn't have the right to edit this comment.")
    })

    it('Should successfully edit a comment', async () => {
        const EDIT_COMMENT = `mutation {
            CommentUpdate(id: "${Comment.id}", text: "Some other comment"){
                id
                text
                post {
                    id
                }
                author {
                    email
                }
            }
        }`
        const res = await driver.send({query: EDIT_COMMENT}).set("token", User.token).then( res => res.body)
        expect(res).to.have.property("data")
                   .which.has.property("CommentUpdate").which.is.not.null
        expect(res.data.CommentUpdate).to.have.property("post")
                                .which.has.property("id")
                                .which.equals(Post.id)
        expect(res.data.CommentUpdate).to.have.property("text")
                                .which.equals("Some other comment")
    })

    it('Should successfully like a comment', async () => {
        const LIKE_COMMENT = `mutation {
            CommentLike(id: "${Comment.id}"){
                id
                text
                likers {
                    id
                }
            }
        }`
        const res = await driver.send({query: LIKE_COMMENT}).set("token", User.token).then( res => res.body)
        expect(res).to.have.property("data")
                   .which.has.property("CommentLike").which.is.not.null
        expect(res.data.CommentLike).to.have.property("likers")
                                .which.includes.something
                                .that.deep.equals({id: User.id})
        expect(res.data.CommentLike).to.have.property("text")
                                .which.equals("Some other comment")
    })

    it('Should successfully dislike a comment', async () => {
        const LIKE_COMMENT = `mutation {
            CommentDisLike(id: "${Comment.id}"){
                id
                text
                dislikers {
                    id
                }
            }
        }`
        const res = await driver.send({query: LIKE_COMMENT}).set("token", User.token).then( res => res.body)
        expect(res).to.have.property("data")
                   .which.has.property("CommentDisLike").which.is.not.null
        expect(res.data.CommentDisLike).to.have.property("dislikers")
                                .which.includes.something
                                .that.deep.equals({id: User.id})
        expect(res.data.CommentDisLike).to.have.property("text")
                                .which.equals("Some other comment")
    })

    it('Should fail at deleting a comment, not the creator', async () => {
        const LIKE_COMMENT = `mutation {
            CommentDelete(id: "${Comment.id}"){
                id
                text
            }
        }`
        const res = await driver.send({query: LIKE_COMMENT}).set("token", User2.token).then( res => res.body)
        expect(res).to.have.property("errors")
                   .which.includes.something
                   .that.has.property("message")
        expect(res.errors[0].message).to.equal("User doesn't have the right to delete this comment.")
    })

    it('Should successfully delete a comment', async () => {
        const LIKE_COMMENT = `mutation {
            CommentDelete(id: "${Comment.id}"){
                id
            }
        }`
        const res = await driver.send({query: LIKE_COMMENT}).set("token", User.token).then( res => res.body)
        expect(res).to.have.property("data")
                   .which.has.property("CommentDelete")
                   .that.deep.equals({id: Comment.id})
    })

    it('Should fail at deleting a comment, since its been deleted already', async () => {
        const LIKE_COMMENT = `mutation {
            CommentDelete(id: "${Comment.id}"){
                id
                text
            }
        }`
        const res = await driver.send({query: LIKE_COMMENT}).set("token", User.token).then( res => res.body)
        expect(res).to.have.property("errors")
                   .which.includes.something
                   .that.has.property("message")
        expect(res.errors[0].message).to.equal("Comment doesn't exist !.")
    })
})