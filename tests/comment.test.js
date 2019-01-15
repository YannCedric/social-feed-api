const {Get, Post, Delete} = require('./CreateTest')
const mongoose = require('mongoose')

const mockPost = {_id:'',
                 text:'This is a test post'+ new Date(),
                 authorId: '',
                 comments: [],
                 tags: ['test']}

Post('/post','Should create a post to be commented', {post:mockPost} , ({expect, res})=>{
    
    expect(res.body).to.be.an('object') 
    expect(res.body.query.text).to.equal(mockPost.text) 
    const newPost = res.body.query

    const mockComment = {
        _id: mongoose.Types.ObjectId.ObjectId(),
        postId: newPost._id,
        authorId: '',
        text: 'Test comment!' + new Date() ,
    }

    const mockComment2 = {
        _id: mongoose.Types.ObjectId.ObjectId(),
        postId: newPost._id,
        authorId: '',
        text: 'Test comment 2!' + new Date() ,
    }

    Post('/comment','Should create comment 2',{comment: mockComment2}, ({expect, res})=>{
        expect(res.body).to.be.an('object')
        expect(res.body.query.nModified).to.equal(1)
        // Level
        Delete('/comment','Should delete the created comment 2',{...mockComment2}, ({expect, res})=>{
            expect(res.body).to.be.an('object')
            expect(res.body.query.nModified).to.equal(1)
            expect(res.body.query.n).to.equal(1)
            expect(res.body.query.ok).to.equal(1)

        })
    })

    // Level 1 
    Post('/comment','Should create a comment',{comment: mockComment}, ({expect, res})=>{
        expect(res.body).to.be.an('object')
        expect(res.body.query.nModified).to.equal(1)
        
        // Level 2
        Post('/comment','Should modify created comment',{comment: {...mockComment, text: "Updating..."}},({expect, res})=>{
            expect(res.body).to.be.an('object')
            expect(res.body.query.nModified).to.equal(1)

        Delete('/post','Should delete the post with comment', {_id: newPost._id} ,({expect, res})=>{
            expect(res.body.query.ok).to.be.equal(1) 
            // Level 3
            Get('/post','New post should now be gone with comment',({expect, res})=>{
                expect(res.body).to.be.an('object')   
                expect(res.body.query).to.be.an('array') 
                expect(res.body.query).to.not.deep.include(newPost)
                })
            })
        })
    })
    

    
})