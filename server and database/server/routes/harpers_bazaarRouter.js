const express = require('express');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Harpers_Bazaar = require('../models/harpers_bazaar');

const harpersBazaarRouter = express.Router();

harpersBazaarRouter.route('/')
.get((req,res,next) => {
    Harpers_Bazaar.find({})
    .then((harpers_bazaar) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(harpers_bazaar);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    
    try {
        for (let i = 0; i < req.body.harpers_bazaar.length; i++) {
            if (!req.body.harpers_bazaar[i].img.src.indexOf('https://hips.hearstapps.com/') === -1 && !req.body.harpers_bazaar[i].link.indexOf('https://www.harpersbazaar.com/tw') === -1) {
                throw new Error('403 forbidden');
            } 
            response = await Harpers_Bazaar.findOneAndUpdate({ title: req.body.harpers_bazaar[i].title }, req.body.harpers_bazaar[i], { upsert: true, new: true });
            console.log('Article created', response);
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
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
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Harpers_Bazaar.findOneAndRemove(req.query._id)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

module.exports = harpersBazaarRouter;