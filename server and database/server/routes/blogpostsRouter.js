const express = require('express');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Blogposts = require('../models/blogposts');
const Users = require('../models/user');

const blogpostsRouter = express.Router();

blogpostsRouter.route('/')
.get((req,res,next) => {
    Blogposts.find({})
    .populate({comments: 'author'}, 'username')
    .then((blogposts) => {
        blogposts = blogposts.map((post) => {delete post.data.author._id; return post});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blogposts);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    try {
        req.body.data.author = req.user._id; // it's possible that this doesnt work
        var user = await Users.findOne({ _id: req.user._id });
        req.body.data.subscribers.push(user.username);
        console.log("Request body _id: ", req.body._id);
        if (req.body._id) {
            var blogpost = await Blogposts.findById({ _id: req.body._id });
            for (var field in Users.schema.eachPath) {
                if (field !== '_id' && field !== '__v') {
                    blogpost[field] = req.body[field];
                }
            }
            blogpost.save();
        }
        else {
            await Blogposts.create(req.body);
        }
        var blogpost = await Blogposts.findOne({ name: req.body.name }).lean();
        if (blogpost.name === req.body.name) {
            console.log('Blogpost created', blogpost);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, blogpost: blogpost });
        }
        else {
            res.json('Something went wrong. The name in the post was not the same as the one in the returned item from the db. Req name: ' + req.body.name + '/  Returned name: ' + blogpost.name);
        }
    }
    catch (err) {
        console.log(err);
        next(err);
    }
})
.put((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Blogposts.findOneAndRemove(req.query._id)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

module.exports = blogpostsRouter;