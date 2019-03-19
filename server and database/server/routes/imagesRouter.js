const express = require('express');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');



const Images = require('../models/images');

const imagesRouter = express.Router();


imagesRouter.route('/')
.get((req,res,next) => {
    Images.find({})
    .then((image) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(image);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    try {
        var image = await Images.findOneAndUpdate({ alt: req.body.alt }, req.body, {upsert: true})
        console.log('Image created', image);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        if (image !== null) {
            res.json({ success: true, image: image });
       }
       else {
           res.json(image);
       }
    }
    catch (e) {
        console.log(e);
        next(e);
    }
})
.put((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    console.log('The request query id: ' + req.query._id);
    try {
        var deleted = await Images.findByIdAndDelete(req.query._id);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, deleted: deleted });
    }
    catch (e) {
        next(e);
    }
});

module.exports = imagesRouter;

