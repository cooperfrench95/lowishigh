const express = require('express');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Projects = require('../models/projects');

const projectsRouter = express.Router();

projectsRouter.route('/')
.get((req,res,next) => {
    Projects.find({})
    .then((project) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(project);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Projects.create(req.body)
    .then((project) => {
        console.log('Project created', project);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, project: project });
    }, (err) => next(err)) 
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Projects.remove(req.query)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

module.exports = projectsRouter;