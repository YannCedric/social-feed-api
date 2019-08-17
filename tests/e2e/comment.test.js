describe('🧪 - Comments Scenarios', async _ => {
    before( async () => {
        let localDriver = chai.request("http://localhost:8000").post('/').set("content-type", "application/json") 
        const CREATE_USER = `mutation{
            CreateUser(email: "jondoee@mail.com",password:"test",username:"jonn",fullname:"jondoe") {
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
        User = res1.data.CreateUser.User
        User.token = res1.data.CreateUser.token
        
        let localDriver2 = chai.request("http://localhost:8000").post('/').set("content-type", "application/json") 
        const CREATE_POST = `mutation{
            CreatePost(text:"Some text", tags: ["tag1", "tag2"]){
                id
                text
                tags
                author {
                    email
                }
            }
        }`
        const res2 = await localDriver2.send({query: CREATE_POST}).set("token", User.token).then( res2 => res2.body)
        Post = res2.data.CreatePost
    })

    it('Should successfully make a comment', async () => {
        const MAKE_COMMENT = `mutation {
            MakeComment(postId: "${Post.id}", text: "Some comment"){
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
        expect(res).to.have.property("data").which.has.property("MakeComment").which.is.not.null
        expect(res.data.MakeComment).to.have.property("post")
                                .which.has.property("id")
                                .which.equals(Post.id)

        expect(res.data.MakeComment).to.have.property("author")
                                .which.has.property("email")
                                .which.equals(User.email)
        Comment = res.data.MakeComment
    })

    it('Should successfully edit a comment', async () => {
        const EDIT_COMMENT = `mutation {
            EditComment(id: "${Comment.id}", text: "Some other comment"){
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
                   .which.has.property("EditComment").which.is.not.null
        expect(res.data.EditComment).to.have.property("post")
                                .which.has.property("id")
                                .which.equals(Post.id)
        expect(res.data.EditComment).to.have.property("text")
                                .which.equals("Some other comment")
    })

    // it('Should successfully like a comment', async () => {
    //     const LIKE_COMMENT = `mutation {
    //         LikeComment(id: "${Comment.id}"){
    //             id
    //             text
    //             likers {
    //                 id
    //             }
    //         }
    //     }`
    //     const res = await driver.send({query: LIKE_COMMENT}).set("token", User.token).then( res => res.body)
    //     expect(res).to.have.property("data")
    //                .which.has.property("LikeComment").which.is.not.null
    //     expect(res.data.LikeComment).to.have.property("likers")
    //                             .which.includes.something
    //                             .which.has.property("id")
    //                             .which.equals(User.id)
    //     expect(res.data.LikeComment).to.have.property("text")
    //                             .which.equals("Some other comment")
    // })
})