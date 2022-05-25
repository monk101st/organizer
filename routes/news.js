const express = require('express');
const router = express.Router();
const News = require('../models/news');

/* GET news page. */
router.get('/', (req, res, next) => {
  const findNews = News.find(); //Wyszukanie wszystkich newsów

  findNews.exec((err, data) => {    //metoda exec pozwala na kilkukrotnewykorzystanie findNews

    res.render('news', { 
      title: 'News',
      data
   });
  });
});

router.get('/show/:id', (req, res, next) => {

  News.findById(req.params.id, (err, data) => {

    const dataCounter = data.counter + 1;

    News.findByIdAndUpdate(data.id, {counter: dataCounter}, (err) => {
      
      res.render('news-show', { 
        data,
      });
      console.log(data.counter);
    })
  })

});

module.exports = router;