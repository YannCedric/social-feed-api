const express = require('express')
const app = express()
const logger = require('fancy-log')
const argv = require('yargs').argv
const {p = 3000 , port = p} = argv
const bodyParser = require('body-parser');
const { getAllPosts,
        searchPosts, 
        upsertPost, 
        deletePost, 
        upsertComment, 
        deleteComment, 
        upsertUser, 
        getUserData,
        deleteUser,
        getAllProfiles } = require('./Queries')

const log = (message) => { if(process.env["NOLOGS"]!== 'true') logger(message) }

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token, businessName, service");
    next()
})

// == LOGGING ==

// ============

app.get('/', (req, res) => {
    res.status(200)
    res.json({message: 'healthy'})
    log('GET - [/] ')
})

app.get('/post', async (req, res) => {
    const status = 500
    const message = "success"

    const query = await getAllPosts()


    res.status(200)
    res.json({message, query})
    log(`GET - [/post] - ${status} - ${message}`)
})

app.get('/search/post/:authorId/:content/:tags', async (req, res) => {
    const status = 500
    let {authorId, content, tags} = req.params
    const message = "success"
    authorId = authorId == '_' ? null : authorId
    content = content == '_' ? null : content
    tags = tags == '_' ? null : tags
    const query = await searchPosts({authorId, content, tags})


    res.status(200)
    res.json({message, query})
    log(`GET - [/post] - ${status} - ${message}`)
})

app.post('/post', async (req, res) => {
    const {post} = req.body
    let status = 500
    let message = "success"
    let query = {}

    if(post){
        query = await upsertPost(post)
        status = 200
    }
    else {
        status = 400
        message = "No post in body"
    }

    res.status(status)
    res.json({message, query})
    log(`POST - [/post] - ${status} - ${message}`)
})

app.delete('/post', async (req, res) => {
    const {_id} = req.body
    
    let status = 500
    let message = "success"
    let query = {}
    
    if(_id){
        query = await deletePost(_id)
        status = 200
    }
    else {
        message = "No ID"
        status = 400
    }

    res.status(status)
    res.json({message, query})
    log(`DELETE - [/post] - ${status} - ${message}`)
})

app.post('/comment', async (req, res) => {
    const {comment} = req.body
    let status = 500
    let message = "success"
    let query = {}

    if(comment)
        query = await upsertComment(comment)
    else {
        message = "No comment in body"
        status = 400
    }

    res.status(status)
    res.json({message, query})
    log(`POST - [/commment] - ${status} - ${message}`)
})

app.post('/user', async (req, res) => {
    const {userData} = req.body
    let status = 500
    let message = "success"
    let query = {}

    if(userData){
        query = await upsertUser(userData)
        status = 200
    }
    else {
        status = 400
        message = "No user data"
    }

    res.status(status)
    res.json({message, query})
    log(`POST - [/user] - ${status} - ${message}`)
})

app.get('/users/:ids', async (req, res) => {
    const {ids} = req.params
    let status = 500
    let message = "success"
    let query = {}
    let idsArray = ids.split(',')
    let map = {}
    if(ids){
        query = await getAllProfiles(idsArray)
        if(query.length == idsArray.length )
            for(let i = 0; i<query.length; i++)
                map[idsArray[i]] = query[i]
        
        status = 200
    }
    else {
        status = 400
        message = "No user ids array"
    }

    res.status(status)
    res.json({message, query, map})
    log(`Get - [/users] - ${status} - ${message}`)
})

app.get('/user/:id', async (req, res) => {
    const {id} = req.params
    let status = 500
    let message = "success"
    let query = {}

    if(id){
        query = await getUserData(id)
        status = 200
    }
    else {
        status = 400
        message = "No user id"
    }

    res.status(status)
    res.json({message, query})
    log(`GET - [/user/${id}] - ${status} - ${message}`)
})

app.delete('/user/:id', async (req, res) => {
    const {id} = req.params
    let status = 500
    let message = "success"
    let query = {}

    if(id){
        query = await deleteUser(id)
        status=200
    }
    else {
        status = 400
        message = "No user id"
    }

    res.status(status)
    res.json({message, query})
    log(`POST - [/commment] - ${status} - ${message}`)
})

app.delete('/comment', async (req, res) => {
    const {_id, postId} = req.body
    
    let status = 500
    let message = "success"
    let query = {}
    
    if(_id){
        query = await deleteComment({_id, postId})
        status = 200
    }
    else {
        message = "No comment Id or  post Id"
        status = 400
    }

    res.status(status)
    res.json({message, query})
    log(`DELETE - [/comment] - ${status} - ${message}`)
})

module.exports = app.listen(port, ()=> {
    log('Social feed api started on port '+port)
})
