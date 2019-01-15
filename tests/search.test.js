const {Get, Post, Delete} = require('./CreateTest')
const mongoose = require('mongoose')

const mockPost = {
            _id: mongoose.Types.ObjectId.ObjectId(), 
            text:'This is a test post !'+ new Date() , 
            authorId: mongoose.Types.ObjectId.ObjectId() , 
            comments: [] , 
            tags: ['test']
        }

Post('/post','Should create a post to be commented for search', {post:mockPost} , ({expect, res})=>{
    
    expect(res.body).to.be.an('object') 
    expect(res.body.query.text).to.equal(mockPost.text) 
    const newPost = res.body.query

    const mockComment = {
        _id: mongoose.Types.ObjectId.ObjectId(),
        postId: newPost._id,
        authorId: mongoose.Types.ObjectId.ObjectId(),
        text: 'Test comment!' + new Date() ,
    }
    const mockComment2 = {
        _id: mongoose.Types.ObjectId.ObjectId(),
        postId: newPost._id,
        authorId: mongoose.Types.ObjectId.ObjectId(),
        text: 'Test comment 2!' + new Date() ,
    }
    // Level 1 
    Post('/comment','Should create a comment for search',{comment: mockComment}, ({expect, res})=>{
        expect(res.body).to.be.an('object')
        expect(res.body.query.nModified).to.equal(1)
        
        Post('/comment','Should create a comment 2 for search',{comment: mockComment2}, ({expect, res})=>{
            expect(res.body).to.be.an('object')
            expect(res.body.query.nModified).to.equal(1)
            
            Get(`/search/post/${mockPost.authorId}/${'_'}/${'_'}`,'Should perform search with query',({expect, res})=>{
                expect(res.body).to.be.an('object')   
                expect(res.body.query[0].comments.length).to.be.equal(2) 
                expect(res.body.query).to.be.an('array')

                Delete('/post','Should delete a post for search', {_id: mockPost._id} ,({expect, res})=>{
                    expect(res.body.query.ok).to.be.equal(1) 
                    // Level 3
                    Get('/post','New post for search should now be gone',({expect, res})=>{
                        expect(res.body).to.be.an('object')   
                        expect(res.body.query).to.be.an('array') 
                        expect(res.body.query).to.not.deep.include(mockPost)
                    })
                })
            })

        })
    })
})
