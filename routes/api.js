const express = require('express');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: '../public/tmp/' });
const router = express.Router();
const fs = require('fs');


/* GET home page. */
router.get('/', (req, res, next) => {
  
  
  res.render('api', { title: 'API' });
});

router.get('/addfile', (req, res, next) => {
  const body = req.body;
  
  res.render('addfile-form', { title: 'Dodaj Plik' });

});

router.post('/addfile', upload.single('filename'), (req, res, next) => {
  const title = req.body.title;
  const file = req.file;

      console.log(title);
      console.log(file);

    res.render('addfile-form', { title: 'Dodaj Plik' });

});

module.exports = router;