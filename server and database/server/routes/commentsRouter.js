const express = require('express');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
var nodemailer = require('nodemailer');
const Blogposts = require('../models/blogposts');
const Users = require('../models/user');

// connect to the mail server over TLS
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'lowishigh.server@gmail.com',
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    }
});

const commentsRouter = express.Router();

commentsRouter.route('/')
.get((req,res,next) => {
    res.statusCode = 403;
    res.json('That operation is not supported on this route')
})
.post(authenticate.verifyUser, async (req, res, next) => {
    try {
        // The incoming object body: postToUpdate (blogpost), newComment (comment), subscribeMe (bool)
        // 1. add comment to blogpost
        var blogpost = req.body.postToUpdate;
        var user = req.user;
        if (blogpost.data.comments) {
            blogpost.data.comments.splice(-1, 0, req.body.newComment)
        }
        else {
            blogpost.data.comments = [req.body.newComment]
        }
        // If user requested, subscribe them to the comment thread
        if (req.body.subscribeMe === true) {
            blogpost.data.subscribers.splice(-1, 0, user.username);
        }
        blogpost = await Blogposts.findOneAndUpdate({ name: req.body.postToUpdate.name }, blogpost, { upsert: true }, (err, doc) => {
            if (err) {
                throw err;
            }
            else if (doc) {
                return doc;
            }});
        // send a message to all of the subscribers
        if (blogpost.data.subscribers) {
            blogpost.data.subscribers.map(async (item, index) => {
                var subscriber = await Users.findOne({ username: item });
                subscriber.inbox = [...subscriber.inbox, { ...newComment, read: false, post: blogpost.data.title }];
                await Users.findOneAndUpdate({ username: subscriber.username }, subscriber);
                var mailOptions = {
                    from: 'lowishigh.server@gmail.com', // sender address
                    to: fixFilteredChars.fixOutput(subscriber.email), // VERY IMPORTANT that this is user.recovery_email, not req.body.email or something
                    subject: 'New Comment on ' + blogpost.data.title, // Subject line
                    text: "There's a new comment on " + blogpost.data.title + '. Go check it out at your inbox now!! https://www.loishigh.com/account',
                    html: "<p>There's a new comment on <strong>" + blogpost.data.title + '</strong>. Go check it out at your inbox now!! https://www.loishigh.com/account</p>'
                };
                transporter.sendMail(mailOptions1, (error, info) => {
                    if (error) {
                        console.log(error);
                        throw (error);
                    }
                });
            });
        }
    }
    catch (err) {
        next(err);
    }
})
.put((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.delete(authenticate.verifyUser, async (req, res, next) => {
    try {
        if (req.user.admin === true || req.user.username === req.body.comment.author) {
            var blogpost = await Blogposts.find({ name: req.body.blogpost.name });
            blogpost.data.comments = blogpost.data.comments.filter(i => i.content !== req.body.comment.content);
            await Blogposts.findOneAndUpdate({ name: blogpost.name }, blogpost);
            // delete the comment from people's inboxes
            blogpost.data.subscribers.map(async (subscriber) => {
                let sub = await Users.findOne({ username: subscriber });
                sub.inbox = sub.inbox.filter(i => i.content !== req.body.comment.content);
                await Users.findOneAndUpdate({ _id: sub.id }, sub);
            })
            res.statusCode = 200;
            res.json({ success: true })
        }
    }
    catch (err) {
        next(err);
    }
});

commentsRouter.route('/read')
.get((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.post(authenticate.verifyUser, async (req, res, next) => {
    try { // Mark a comment in the inbox as read
        var user = { ...req.user }
        user.inbox.map((message) => {
            if (req.body.message._id === message._id) {
                message.read = true;
            }
            return message
        })
        Users.findOneAndUpdate({ _id: req.user._id }, { ...req.user, inbox: user.inbox }, (err) => {
            next(err);
        });
        res.statusCode = 200;
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
})
.put((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.delete((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})

module.exports = commentsRouter;