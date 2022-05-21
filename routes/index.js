const express = require('express');
const router = express.Router();

const login = 'monk101st@gmail.com';
const password = 'maciek3003'

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express1' });
});

/* GET login page. */
router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Logowanie' });
});

/* POST login page. */
router.post('/login', (req, res, next) => {
  const body = req.body;

  if(body.login === login && body.password === password) {
    req.session.admin = 1;

    res.redirect('/admin');
  }else {
    res.redirect('/login');
  }

  res.redirect('/login');
});

module.exports = router;
