require('dotenv').config()
var passport = require('passport');
var User = require('./models/user');
var Blacklist = require('./models/jwtBlacklist');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var crypto = require('crypto');
var mongoose = require('mongoose');

exports.verifyUser = passport.authenticate('jwt', {session: false});
exports.verifyAdmin = (req, res, next) => {
    req.user = req.user[0];
    if (req.user.admin === true) {
        return next();
    }
    else {
        err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
};


var opts = { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: process.env.SECRET_KEY }

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: mongoose.Types.ObjectId(jwt_payload._id) }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                Blacklist.find({ user: user._id }, (err, list) => {
                    if (err) {
                        console.log(err);
                        return done(err, false);
                    }
                    if (list.length === 0) {
                        user.jwt = jwt_payload;
                        return done(null, user); // success
                    }
                    else if (list.length !== 0) {
                        return done(null, false, { message: "Invalid token!" })
                    }
                });
            }
            else {
                return done(null, false, { message: "User not found" });
            }
        });
}));

exports.getToken = function(userID) {
    return jwt.sign(userID, process.env.SECRET_KEY,
        {expiresIn: "2d", jwtid: crypto.randomBytes(64).toString('hex')});
};
