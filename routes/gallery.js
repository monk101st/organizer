const express = require('express');
const path = require('path');
const multer = require('multer');

const router = express.Router();
const Upload = require('../models/upload');
const fs = require('fs');


var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "./public/images/galeries");
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  });
   
  var upload = multer({
    storage: Storage,
  }).single("image"); //Field name and max count


router.get('/', (req, res, next) => {
    const imageData = Upload.find({})

  imageData.exec(function(err,data){
      if(err) throw err;
      console.log(data);
      res.render('gallery', { title: 'GALERIE', data });
  })
});

router.post("/", (req, res) => {
    const imageData = Upload.find({})
    
    
    upload(req, res, function (err) {
      console.log(req.file);
      console.log(req.body.name);
      if (err) {
        console.log(err);
        return res.end("Something went wrong");
      } else {
        console.log(req.file.path);
        var imageName = req.file.filename;
   
        var imageDetails = new Upload({
          imagename: imageName,
          gallery: req.body.name,
        });
   
          imageDetails.save(function (err, doc) {
            if (err) throw err;
    
            console.log("Image Saved");
    
            imageData.exec(function(err,data){
                if(err) throw err;
    
    
                res.render('gallery', {title: 'GALERIE', records: data, success:true})
          })
        });
      }
    });
});


module.exports = router;