const express = require('express');
const router = express.Router();
const Users = require('../models/users');

const login = 'monk101st';
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
  console.log(body);
  Users.find({nick: body.login}, (err, data) => {
    const newData = data[0];
    console.log(newData);

    if(body.login === newData.nick && body.password === newData.password) {
      req.session.admin = {
        sesStatus: 1,
        sesName: newData.name,
        sesSurname: newData.surname,
        sesAvatar: newData.avatar
      }
      res.redirect('/admin');
    }else {
      res.redirect('/login');
    }
  })
});

module.exports = router;
