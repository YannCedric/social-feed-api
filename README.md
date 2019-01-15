# Social Feed API - [![Build Status](https://travis-ci.com/YannCedric/social-feed-api.svg?branch=master)](https://travis-ci.com/YannCedric/social-feed-api)

Simple social feed api, providing basic functionality!

You might want to use your own authentication layer as the routes are not protected.

## Variables

You must link the container to a database.  
The container currently supports mongoDB.  
You must set the following variables for the container to connect to the database:  
* *MONGO_ADDRESS* - addess to the database. The default value is localhost.
* *USERNAME* - database user username.
* *DB_PASS* - database user password.
* *DB_PORT* - database port
* *AUTH_DB* - authentication database. The default value is admin.

## Routes
All requests should be made with application/json content-type

* *GET - /post* - get all posts
* *POST - /post* - body: { post } - add/update a post
* *DELETE - /post* - body: { _id } - delete a post.  

* *POST - /comment* - body: { comment } - make a comment on a post.  
* *DELETE - /comment* - body: { _id, postId } - delete a comment from a post.

* *POST - /user* - body: { userData } - add/update a user.
* *GET - /user/:id* - get user data.
* *GET - /user/:ids* - get users data from an array of user ids.
* *DELETE - /user/:id* - delete a user.

* *GET - /search/post/:authorId/:content/:tags* - search for post by author id, content, tags, or any combination.
> PS: for the search route, set any empty value for a field to '_' to skip it. For example, to query a post by a specific author, use the route <b>/search/post/:authorId / _ / _ </b>

## Data format 

**post** - { _id: ObjectId, text: String, authorId: ObjectId, comments: [Comment], tags: [String] } 

**comment** - { _id: ObjectId, text: String, postId: ObjectId, likes: [ObjectId], dislikes: [ObjectId], authorId: ObjectId }

**user** - { _id: ObjectId, name: String, picture: String, bio: String, followers: [ObjectId], following: [ObjectId] }


