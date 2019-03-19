require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
var bCrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
const fixFilteredChars = require('../FilterCharacters');
const Users = require('../models/user');
const Blacklist = require('../models/jwtBlacklist');
const resetKeys = require('../models/resetKey');
const userRouter = express.Router();


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




userRouter.route('/signup')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Users.find({})
    .then((returnedUsers) => {
        returnedUsers = returnedUsers.map((user) => {return user.username})
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(returnedUsers);
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(async function (req, res, next) {

    try {
        // Check the password length is good
        if (req.body.password.length < 20 || req.body.password.length > 60) {
            throw new Error('That password is not acceptable. Should be between 20 and 60 characters.');
        }
        else if (req.body.username.length < 8 || req.body.username.length > 25) {
            throw new Error('That username is not acceptable. Should be between 8 and 25 characters.');
        }
        else if (req.body.email.length > 100 || req.body.recovery_email.length > 100 || !req.body.recovery_email.match(/@/g) || !req.body.email.match(/@/g)) {
            throw new Error('That email is not valid.')
        }
        // Hash the password with bcrypt
        var hash = await bCrypt.hash(req.body.password, 12)
        // Add it to the database
        var user = await Users.create({...req.body, admin: false, password: hash}) 
        
        hash = '';
        console.log('User created: ', user.username);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user.username);
    }
    catch (err) {
        console.log('Error: ' + err.message);
        res.json({ error: err.message });
        next(err);
    }

})
.put((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.delete(authenticate.verifyUser, async (req, res, next) => {
    
    try {
        if (req.user) {
            var user = await Users.findOne({ username: req.body.username });
            if (req.user.admin && req.user.username !== user.username && !user.admin) { // If they are an admin and they want to delete someone else's acccount
                Users.remove({ username: req.body.username })
                .then(async (response) => {
                    var blogposts = await Blogposts.find({});
                    blogposts.map(async (blogpost) => {
                        var changed = false;
                        if (blogpost.data.comments) {
                            blogpost.data.comments = blogpost.data.comments.filter((i) => i.author !== req.body.username);
                            changed = true
                        }
                        if (blogpost.data.subscribers) {
                            blogpost.data.subscribers = blogpost.data.subscribers.filter(i => i !== req.body.username);
                            changed = true
                        }
                        if (changed === true) {
                            await Blogposts.findOneAndUpdate({ name: blogpost.name}, blogpost);
                        }
                        return
                    })
                    res.statusCode = 200;
                    res.json({ success: true });
                }, (err) => {throw err})
            }
            else if (req.user.username === user.username && !req.user.admin) { // If they are not an admin and they want to delete their own account
                Users.remove({ username: req.body.username })
                .then(async (response) => {
                    var blogposts = await Blogposts.find({});
                    blogposts.map(async (blogpost) => {
                        var changed = false;
                        if (blogpost.data.comments) {
                            blogpost.data.comments = blogpost.data.comments.filter((i) => i.author !== req.body.username);
                            changed = true
                        }
                        if (blogpost.data.subscribers) {
                            blogpost.data.subscribers = blogpost.data.subscribers.filter(i => i !== req.body.username);
                            changed = true
                        }
                        if (changed === true) {
                            await Blogposts.findOneAndUpdate({ name: blogpost.name}, blogpost);
                        }
                        return
                    })
                    res.statusCode = 200;
                    res.json({ success: true });
                }, (err) => {throw err})
            }
            else {
                throw new Error("You can't delete that user account")
            }
        }
    }
    catch (err) {
        console.log(err);
        res.statusCode = 403;
        res.json({ success: false });
        next(err);
    }

});




userRouter.route('/login')
.get((req,res,next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.post( async (req, res, next) => {
    
    try {
        user = await Users.findOne({username: req.body.username});
        // Compare the password to the one in the DB, if successful issue the token
        var result = await bCrypt.compare(req.body.password, user.password);
        if (result === true) {
            token = authenticate.getToken({ _id: user._id });
            res.statusCode = 200;
            res.json({ jwt: token, username: user.username, inbox: user.inbox, admin: user.admin })
        }
        else {
            throw new Error('403 wrong password.')
        }
    }
    catch (err) {
        console.log('Error: ' + err.message);
        res.json({ error: err.message });
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
});




userRouter.route('/logout')
.get((req,res,next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.post(authenticate.verifyUser, async function (req, res, next) {
    
    try {
        if (req.user) {
        
            // Add the jwt token to the blacklist
            await Blacklist.create({ jwt_value: req.user.jti, user: req.user._id });

            // Success
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, message: "You have logged out!"})

        }
        else {
            var err = new Error('You are not logged in!');
        }
    }
    catch (err) {
        console.log('Error: ' + err.message);
        res.json({ error: err.message });
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
});




userRouter.route('/changepassword') // This is for resetting from within your account
.get((req,res,next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.post(authenticate.verifyUser, async function (req, res, next) {
    
    try {
        if (req.user) {
            // Get the user from the DB
            var user = await Users.findOne({ _id: req.user._id });
            var secret = await crypto.randomBytes(128).toString('hex');

            // Create a secret key and store it in the database. If there is already one in there, it should throw because user._id needs to be unique
            await resetKeys.create({ current_reset_key: secret, user: user._id });

            // Create the tokens
            var resetJWT = authenticate.getToken({_id: user._id});
            var token = await bCrypt.hash(secret + req.ip, 12);
            var emailToken = authenticate.getToken({ hash: token });
    
            var mailOptions1 = {
                from: 'lowishigh.server@gmail.com', // sender address
                to: fixFilteredChars.fixOutput(user.recovery_email), // VERY IMPORTANT that this is user.recovery_email, not req.body.email or something
                subject: 'Password Reset', // Subject line
                text: 'Your account received a request to reset the password.' + ' If this was not you, ignore this email and do not visit the link. Otherwise, ' + 
                        'go to https://localhost:3444/newpassword/ and when prompted, enter the following:  Token 1: '  + resetJWT,
                html: '<p>Your account received a request to reset the password. If this was not you, <b>ignore this email and do not visit the link.</b> The tokens expire in 5 minutes.</p>' + 
                '<p> Otherwise, go to <b>https://localhost:3444/newpassword/</b>, and when prompted, enter the following: </p>' + 
                '<p> Token 1: <span>' + resetJWT + '</span></p>'
            };

            var mailOptions2 = {
                from: 'lowishigh.server@gmail.com', // sender address
                to: fixFilteredChars.fixOutput(user.email), // VERY IMPORTANT that this is user.recovery_email, not req.body.email or something
                subject: 'Password Reset', // Subject line
                text: 'Your account received a request to reset the password.' + ' If this was not you, ignore this email and do not visit the link. Otherwise, ' + 
                        'go to https://localhost:3444/newpassword/ and when prompted, enter the following: ' + 'Token 2: ' + emailToken,
                html: '<p>Your account received a request to reset the password. If this was not you, <b>ignore this email and do not visit the link.</b> The tokens expire in 5 minutes.</p>' + 
                '<p> Otherwise, go to <b>https://localhost:3444/newpassword/</b>, and when prompted, enter the following: </p>' + 
                '<p>Token 2: </p><span>' + emailToken + '</span></p>'
            };
            
            transporter.sendMail(mailOptions1, (error, info) => {
                if (error) {
                    console.log(error);
                    throw (error);
                }
            });
            transporter.sendMail(mailOptions2, (error, info) => {
                if (error) {
                    console.log(error);
                    throw (error);
                }
            });
            console.log('Message sent: %s', info.messageId);
            res.statusCode = 200;
            res.json({ success: true, message: "Emails sent!"})
        }
    }
    
    catch (err) {
        console.log('Error: ' + err.message);
        res.json({ error: err.message });
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
});




userRouter.route('/forgotpassword') // This is for resetting from outside your account. For security, always return that the email has been sent.
.get((req,res,next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.post(async function(req, res, next) {
    
    try {
        if (req.body.email) {
            // Get the user from the DB, create the secret, and save it to the DB
            var user = await Users.findOne({ email: req.body.email });
            var secret = await crypto.randomBytes(128).toString('hex');
            await resetKeys.create({ current_reset_key: secret, user: user._id });

            // Create the tokens for the email
            var resetJWT = authenticate.getToken({_id: user._id});
            var token = await bCrypt.hash(secret + req.ip, 12);
            var emailToken = authenticate.getToken({ hash: token });

            var mailOptions1 = {
                from: 'lowishigh.server@gmail.com', // sender address
                to: fixFilteredChars.fixOutput(user.recovery_email), // VERY IMPORTANT that this is user.recovery_email, not req.body.email or something
                subject: 'Password Reset', // Subject line
                text: 'Your account received a request to reset the password.' + ' If this was not you, ignore this email and do not visit the link. Otherwise, ' + 
                        'go to https://localhost:3444/newpassword/ and when prompted, enter the following:  Token 1: '  + resetJWT,
                html: '<p>Your account received a request to reset the password. If this was not you, <b>ignore this email and do not visit the link.</b> The tokens expire in 5 minutes.</p>' + 
                '<p> Otherwise, go to <b>https://localhost:3444/newpassword/</b>, and when prompted, enter the following: </p>' + 
                '<p> Token 1: <span>' + resetJWT + '</span></p>'
            };

            var mailOptions2 = {
                from: 'lowishigh.server@gmail.com', // sender address
                to: fixFilteredChars.fixOutput(user.email), // VERY IMPORTANT that this is user.recovery_email, not req.body.email or something
                subject: 'Password Reset', // Subject line
                text: 'Your account received a request to reset the password.' + ' If this was not you, ignore this email and do not visit the link. Otherwise, ' + 
                        'go to https://localhost:3444/newpassword/ and when prompted, enter the following: ' + 'Token 2: ' + emailToken,
                html: '<p>Your account received a request to reset the password. If this was not you, <b>ignore this email and do not visit the link.</b> The tokens expire in 5 minutes.</p>' + 
                '<p> Otherwise, go to <b>https://localhost:3444/newpassword/</b>, and when prompted, enter the following: </p>' + 
                '<p>Token 2: </p><span>' + emailToken + '</span></p>'
            };
            
            transporter.sendMail(mailOptions1, (error, info) => {
                if (error) {
                    console.log(error);
                    throw (error);
                }
            });
            transporter.sendMail(mailOptions2, (error, info) => {
                if (error) {
                    console.log(error);
                    throw (error);
                }
            });
            console.log('Message sent: %s', info.messageId);
            res.statusCode = 200;
            res.json({ success: true, message: "Emails sent!"})
        }
    }
    
    catch (err) {
        console.log('Error: ' + err.message);
        res.json({ success: true, message: "Email sent!" });
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
});




userRouter.route('/resetpassword/') // Need to make it so that bcrypt and jwt don't produce something with illegal characters
.get((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.post(async function(req,res,next) {
    
    console.log(req.body.token1);
    console.log(req.body.token2);
    console.log(req.ip)
    try {
        if (req.body.token1 && req.body.token2) {
            // This is token 1, the JWT containing the user ID
            var resetToken = await jwt.verify(req.body.token1, process.env.SECRET_KEY);
            console.log('Reset token: ' + resetToken);
            // Get the user
            var user = await Users.findOne({_id: resetToken})
            console.log(user);
            // Get the stored reset key
            var resetKey = await resetKeys.findOne({ user: user._id });
            if (resetKey) {
                // Get the hash out of the second jwt
                var hashed_info = await jwt.verify(req.body.token2, process.env.SECRET_KEY);
                // Check that the hash is the same
                var linkConfirmed = await bCrypt.compare(resetKey.current_reset_key + req.ip, hashed_info.hash);
            }
            if (linkConfirmed) {
                if (req.body.new_password.length < 20) {
                    throw new Error('That password is not long enough! Needs to be at least 20 characters.')
                }
                var newPassword = await bCrypt.hash(req.body.new_password, 12);
                user.password = newPassword;
                user.markModified('password');
                user.save();
                resetKey.remove();
                res.statusCode = 200;
                res.json({ success: true });
            }
            else {
                throw new Error("Expired or invalid reset token, please try again");
            }
        }
        else {
            throw new Error('No JWT or email token found in the link');
        }
    }
    catch (err) {
        console.log('Error: ' + err.message);
        res.json({ error: err.message });
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
});

module.exports = userRouter;