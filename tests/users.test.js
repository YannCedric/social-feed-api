const {Post, Delete, Get} = require('./CreateTest')

const mockUser = {
    name: 'yann',
    bio: 'Im a beast'
}

const mockUser2 = {
    name: 'mola',
    bio: 'I hate cats'
}

const mockUser3 = {
    name: 'ngadeu',
    bio: 'I love dogos'
}

Post('/user','should fail to create a user and mention missing body',{},({expect, res})=>{
    expect(res.body.message).to.include('No')   
    expect(res.status).to.equal(400)
})

Post('/user','should create users',{userData: mockUser2},({expect, res})=>{
    expect(res.body).to.be.an('object')   
    expect(res.status).to.equal(200)
    let newUser2 = res.body.query
    expect(newUser2.name).to.equal(mockUser2.name)
    expect(newUser2.bio).to.equal(mockUser2.bio)

    Post('/user','should create users',{userData: mockUser3},({expect, res})=>{
        expect(res.status).to.equal(200)
        let newUser3 = res.body.query
        expect(newUser3.name).to.equal(mockUser3.name)
        expect(newUser3.bio).to.equal(mockUser3.bio)

        let ids = [newUser2._id, newUser3._id]

        Get(`/users/${ids}`, 'should query users data from ids list', ({expect, res})=>{
            expect(res.status).to.equal(200)
            expect(res.body.query).to.not.be.empty

            const userSearched2 = res.body.map[newUser2._id]
            const userSearched3 = res.body.map[newUser3._id]

            expect(userSearched2.name).to.equal(mockUser2.name)
            expect(userSearched2.bio).to.equal(mockUser2.bio)

            expect(userSearched3.name).to.equal(mockUser3.name)
            expect(userSearched3.bio).to.equal(mockUser3.bio)

            Delete(`/user/${userSearched2._id}`, 'should delete newly created user',{}, ({expect, res})=>{
                expect(res.status).to.equal(200)
                expect(res.body.query.n).to.equal(1)
    
                Get(`/user/${userSearched2._id}`, 'should not be able to find new deleted user', ({expect, res})=>{
                    expect(res.status).to.equal(200)
                    expect(res.body.query).to.be.null
                })
            })

            Delete(`/user/${userSearched3._id}`, 'should delete newly created user',{}, ({expect, res})=>{
                expect(res.status).to.equal(200)
                expect(res.body.query.n).to.equal(1)
    
                Get(`/user/${userSearched3._id}`, 'should not be able to find new deleted user', ({expect, res})=>{
                    expect(res.status).to.equal(200)
                    expect(res.body.query).to.be.null
                })
            })
        })

    })
})

Post('/user','should create new user for editing',{userData: mockUser},({expect, res})=>{
    expect(res.body).to.be.an('object')   
    expect(res.status).to.equal(200)
    let newUser = res.body.query
    expect(newUser.name).to.equal(mockUser.name)
    expect(newUser.bio).to.equal(mockUser.bio)


    Get(`/user/${newUser._id}`, 'should find newly added user', ({expect, res})=>{
        expect(res.status).to.equal(200)
        let searchedUser = res.body.query

        expect(searchedUser.name).to.equal(mockUser.name)
        expect(searchedUser.bio).to.equal(mockUser.bio)
    })

    Get(`/user/${newUser._id}`, 'should find newly added user', ({expect, res})=>{
        expect(res.status).to.equal(200)
        let searchedUser = res.body.query

        expect(searchedUser.name).to.equal(mockUser.name)
        expect(searchedUser.bio).to.equal(mockUser.bio)
    })
    newUser.name = 'cedric'
    newUser.bio = 'I love video games'
    Post('/user','should allow editing created user',{userData: newUser},({expect, res})=>{
        expect(res.status).to.equal(200)
        let editedUser = res.body.query
        expect(editedUser.name).to.equal(newUser.name)
        expect(editedUser.bio).to.equal(newUser.bio)

        expect(editedUser.name).not.to.equal(mockUser.name)
        expect(editedUser.bio).to.not.equal(mockUser.bio)

        Delete(`/user/${editedUser._id}`, 'should delete newly created user',{}, ({expect, res})=>{
            expect(res.status).to.equal(200)
            expect(res.body.query.n).to.equal(1)

            Get(`/user/${editedUser._id}`, 'should not be able to find new deleted user', ({expect, res})=>{
                expect(res.status).to.equal(200)
                expect(res.body.query).to.be.null
            })
        })
    })

})