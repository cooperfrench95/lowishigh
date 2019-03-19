const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');
const fs = require('fs');
const fsPromises = require('fs').promises;
const gm = require('gm').subClass({imageMagick: true});
const path = require('path');


const upload = multer();

const uploadImagesRouter = express.Router();

uploadImagesRouter.route('/')
.get((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('file'), async (req, res, next) => { // upload.single('file') -> 'file' needs to be the same as the html form tag name attribute
    try {
        //Ensure it's the right file type
        if(!req.file.originalName.match(/\.(jpg|jpeg|png)$/)) {
            res.statusCode = 403;
            res.end('You can only upload jpg, png or jpeg files to /imageUploads');
        }
        else {
            if (req.file.originalName.match(/\.(jpeg)$/)) {
                var newName = req.file.originalName.slice(0, -4)
            }
            else if (req.file.originalName.match(/\.(jpg|png)$/)) {
                newName = req.file.originalName.slice(0, -3)
            }
            
            // Strip exif data
            const output = fs.createWriteStream(path.join(__dirname, '../public/images/' + newName + 'png'));
            gm(req.file.stream)
                .strip()
                .stream('png')
                .pipe(output)
            output.end();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true }); // this MUST also add a reference to the image into the database!
        }
    }
    catch (err) {
        console.log(err);
        next(err);
    }
})
.put((req, res, next) => {
    res.statusCode = 403; 
    res.json({ error: 'Operation not supported on this route' });
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    fsPromises.unlink(path.join(__dirname, '../public/images/' + req.body.src))
    .then((resp) => {
        res.statusCode = 200;
        res.json({ success: true });
    }, (err) => next(err))
    .catch((err) => next(err))
});

module.exports = uploadImagesRouter;