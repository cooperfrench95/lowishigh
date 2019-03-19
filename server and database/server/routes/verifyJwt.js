var auth = require('../authenticate');
const express = require('express');


var verifyRouter = express.Router();

verifyRouter.route('/')
.get(auth.verifyUser, (req, res, next) => {
    res.statusCode = 200;
    res.json({ success: true })
})
.post((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.put((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.delete((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})

module.exports = verifyRouter;