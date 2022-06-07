const express = require('express');
const router = express.Router();
const Users = require('../models/users');
const Rules = require('../models/rules');

/* GET home page. */
router.get('/', (req, res, next) => {
  
  //const showForm = !req.session.vote;

    Rules.find({}, (err, rules) => {

        Users.find({}, (err, data) => {
            res.render('register', {
                title: 'Rejestracja',
                body: {},
                errors: {},
                data,
                rules
            });
        })

    })



});

router.post('/', (req, res) => {
    const body = req.body;
  
    if (body.password !== body.passwordconf) {
        res.render('register', {
        passMessage: 'Hasła nie są identyczne',
        body: {},
        errors: {},
        data: {},
        rules: {}
    });
        return;
    }
    const usersData = new Users(body);
    const errors = usersData.validateSync();
    

    usersData.save((err) => {
      if(err) {
        res.render('register', {
          body,
          errors,
          data: {},
          rules: {}
        });
        return;
      }
      res.redirect('/register')
    });


  });
  

module.exports = router;