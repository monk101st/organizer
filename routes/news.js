const express = require('express');
const router = express.Router();
const News = require('../models/news');


/* GET news page. */
router.get('/', (req, res, next) => {
  
  const search = req.query.search || '';

  const findNews = News
  .find({title: new RegExp(search.trim(), 'i')}) //Wyszukanie wszystkich newsów
  .sort({created: -1}); //Sortowanie od najnowszego

  findNews.exec((err, data) => {    //metoda exec pozwala na kilkukrotnewykorzystanie findNews

    res.render('news', { 
      title: 'News',
      data,
      search
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