const express = require('express');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Categories = require('../models/categories');
const Images = require('../models/images');

const categoriesRouter = express.Router();

categoriesRouter.route('/')
.get(async (req,res,next) => {
    try {
        var categoryImages = await Categories.find({}).populate('image');
        console.log(categoryImages);
        res.statusCode = 200;
        res.json(categoryImages)
    }
    catch (err) {
        next(err);
    }
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    try {
        req.body.categories.map(async (cat) => {
            await Categories.findOneAndUpdate({ category: cat.category }, cat, { upsert: true });
        })
        const categorylist = await Categories.find().populate('image');
        res.statusCode = 200;
        res.json({ success: true, categories: categorylist })
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
        var deleted = await Categories.findOneAndDelete({ image: req.query._id });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, deleted: deleted });
    }
    catch (e) {
        next(e);
    }
});

module.exports = categoriesRouter;