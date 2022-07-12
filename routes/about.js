const express = require('express');
const router = express.Router();
const Abouts = require('../models/abouts');

/* GET news page. */
router.get('/', (req, res, next) => {
  const findAbouts = Abouts.find(); //Wyszukanie wszystkich newsów

  findAbouts.exec((err, data) => {    //metoda exec pozwala na kilkukrotnewykorzystanie findNews

    res.render('about', { 
      title: 'Abouts',
      data
   });
  });
});

router.get('/show/:id', (req, res, next) => {

  Abouts.findById(req.params.id, (err, data) => {

    const dataCounter = data.counter + 1;

    Abouts.findByIdAndUpdate(data.id, {counter: dataCounter}, (err) => {
      
      res.render('about-show', { 
        data,
      });
      console.log(data.counter);
    })
  })

});


module.exports = router;