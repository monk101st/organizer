const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz');

/* GET home page. */
router.get('/', (req, res, next) => {
  
  const showForm = !req.session.vote;

  Quiz.find({}, (err, data) => {

    res.render('quiz', { title: 'Quiz', data, showForm });
  })
});

router.post('/', (req, res, next) => {
  const id = req.body.quiz;

  Quiz.findOne({_id: id}, (err, data) => {

    data.vote = data.vote + 1;
    data.save((err) => {
      req.session.vote = 1;
      res.redirect('/quiz');
    })
  })
 
});

module.exports = router;