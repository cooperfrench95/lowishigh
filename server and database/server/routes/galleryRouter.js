const express = require('express');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Gallery = require('../models/gallery');

const galleryRouter = express.Router();

galleryRouter.route('/')
.get(async (req,res,next) => {
    try {
        var galleryImages = await Gallery.find().lean().populate('image')
        for (let i = 0; i < galleryImages.length; i++) {
            if (galleryImages[i].image === null) {
                galleryImages.splice(i, 1);
                Gallery.remove({ _id: galleryImages[i]._id })
            }
        }
        res.statusCode = 200;
        res.json(galleryImages)
    }
    catch (err) {
        next(err);
    }
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    try { 
        await req.body.gallery.map((item) => {
            try {
                Gallery.create({ image: item._id }); 
            }
            catch (e) {
                console.log(e);
            }
        });
        newGallery = await Gallery.find().populate('image');
        res.statusCode = 200;
        res.json({ success: true, gallery: newGallery })
    }
    catch (err) {
        next(err);
    }
})
.put((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    console.log('The request query id: ' + req.query._id);
    try {
        var deleted = await Gallery.findOneAndDelete({ _id: req.query._id });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, deleted: deleted });
    }
    catch (e) {
        next(e);
    }
});

module.exports = galleryRouter;