require('dotenv').config()
var helmet = require('helmet');
var express = require('express');
const rateLimit = require("express-rate-limit");
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var authenticate = require('./authenticate');
var filter = require('content-filter')
var blogpostsRouter = require('./routes/blogpostsRouter');
var harpers_bazaarRouter = require('./routes/harpers_bazaarRouter');
var projectsRouter = require('./routes/projectsRouter');
var imagesRouter = require('./routes/imagesRouter');
var userRouter = require('./routes/userRouter');
var galleryRouter = require('./routes/galleryRouter');
var commentsRouter = require('./routes/commentsRouter');
var categoryRouter = require('./routes/categoriesRouter');
var verifyRouter = require('./routes/verifyJwt');
var uploadImagesRouter = require('./routes/uploadImagesRouter');
var compression = require('compression');
const url = process.env.MONGO_URL;  
const userLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000
});
mongoose.connect(url, { useNewUrlParser: true });

var app = express();
var whitelist = ['https://youtube.com/', 'https://lowishigh.com/', 'https://www.lowishigh.com/']

// Secure traffic only
app.all('*', (req, res, next) => {
    if (req.secure) {
        return next();
    }
    else {
        console.log('Had to issue a redirect response') 
        res.redirect(307, 'https://' + req.hostname + req.url);
    }
});  
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var blacklist = ['$','{','&&','||'];
app.use(filter({dispatchToErrorHandler: true, urlBlacklist: blacklist, bodyBlacklist: blacklist}));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        
        res.setHeader('Access-Control-Allow-Origin', 'https://www.youtube.com/');
    }
}));
app.use(express.static(path.join(__dirname, 'public/build'), {
    setHeaders: (res, path, stat) => {
        res.setHeader('Access-Control-Allow-Origin', 'https://www.youtube.com/');
    }
}));
app.use(passport.initialize());
app.use('/verify', limiter, verifyRouter);
app.use('/blogposts', limiter, blogpostsRouter);
app.use('/harpers_bazaar', limiter, harpers_bazaarRouter);
app.use('/projects', limiter, projectsRouter);
app.use('/images', limiter, imagesRouter);
app.use('/users', userLimiter, userRouter);
app.use('/uploadImages', userLimiter, uploadImagesRouter);
app.use('/comments', userLimiter, commentsRouter);
app.use('/galleryimages', limiter, galleryRouter);
app.use('/categories', limiter, categoryRouter);
// Maybe there should be an error handler here?
app.get('*', function (req, res) { // This is why you recieve the html page upon redirect. It goes all the way down to here when it gets a request that the routers can't handle
    res.setHeader('Access-Control-Allow-Origin', 'https://www.youtube.com/');
    res.sendFile(path.join(__dirname, 'public/build', 'index.html'));  
});

module.exports = app;


