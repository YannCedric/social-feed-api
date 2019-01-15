const {Get, Post, Delete} = require('./CreateTest')

const mockPost = {_id:'' , text:'This is a test post'+ new Date() , authorId: '' , comments: [] , tags: ['test']}
Post('/post','Should create a post', {post:mockPost} ,({expect, res})=>{
    
    expect(res.body).to.be.an('object') 
    expect(res.body.query.text).to.be.equal(mockPost.text) 
    const newEntry = res.body.query
    // Level 1 
    Get('/post','Should get all posts',({expect, res})=>{
        expect(res.body).to.be.an('object')   
        expect(res.body.query).to.be.an('array') 
        expect(res.body.query).to.deep.include(newEntry)
        // Level 2
        Delete('/post','Should delete a post', {_id: newEntry._id} ,({expect, res})=>{
            expect(res.body.query.ok).to.be.equal(1) 
            // Level 3
            Get('/post','New post should now be gone',({expect, res})=>{
                expect(res.body).to.be.an('object')   
                expect(res.body.query).to.be.an('array') 
                expect(res.body.query).to.not.deep.include(newEntry)
            })
        })
    })
})