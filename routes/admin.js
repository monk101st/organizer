const express = require('express');
const router = express.Router();
const News = require('../models/news');
const Abouts = require('../models/abouts');

router.all('*', (req, res, next) => {
  if(!req.session.admin) {
    res.redirect('login');

    return;
  }

  next();
});

/*######### GET ADMINISTRATOR PANEL ROUTER ##############*/
router.get('/', (req, res, next) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  res.render('admin/index', { 
    title: 'Administration Panel',
    userName: userName,
    userSurname: userSurname
  });
});

/*######### GET NEWS ROUTER ##############*/

router.get('/news-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;

  console.log(req.session.admin);
  res.render('admin/news-list', { 
    title: 'News List',
    userName: userName,
    userSurname: userSurname
  });
});

router.get('/news/add', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;

  res.render('admin/news-form', {
    title: 'Dodaj news',
    userName: userName,
    userSurname: userSurname,
    body: {},
    errors: {},
     });

});


router.post('/news/add', (req, res) => {
  const body = req.body;

  const newsData = new News(body);
  const errors = newsData.validateSync();
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;


  newsData.save((err) => {
    if(err) {
      res.render('admin/news-form', {
        title: 'Dodaj news',
        userName: userName,
        userSurname: userSurname,
        errors,
        body
      });
      return;
    }
    res.redirect('/admin/news-list')
  });

});

/*######### ABOUT ROUTER ##############*/

router.get('/about-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;

  console.log(req.session.admin);
  res.render('admin/about-list', { 
    title: 'About List',
    userName: userName,
    userSurname: userSurname
  });
});

  router.get('/about/add', (req, res) => {
    const userName = req.session.admin.sesName;
    const userSurname = req.session.admin.sesSurname;
  
    console.log(req.session.admin);
    res.render('admin/about-form', { 
      title: 'Dodaj artykuł - About',
      userName: userName,
      userSurname: userSurname,
      body: {},
      errors: {}
    });

});

router.post('/about/add', (req, res) => {
  const body = req.body;

  const aboutsData = new Abouts(body);
  const errors = aboutsData.validateSync();
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;


  aboutsData.save((err) => {
    if(err) {
      res.render('admin/about-form', {
        title: 'Dodaj About',
        userName: userName,
        userSurname: userSurname,
        errors,
        body
      });
      return;
    }
    res.redirect('/admin/about-list')
  });

});

/*######### PROJECT ROUTER ##############*/

router.get('/project-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;

  console.log(req.session.admin);
  res.render('admin/project-list', { 
    title: 'Project List',
    userName: userName,
    userSurname: userSurname
  });
});

/*######### QUIZES ROUTER ##############*/

router.get('/quizes-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;

  console.log(req.session.admin);
  res.render('admin/quizes-list', { 
    title: 'Quizes List',
    userName: userName,
    userSurname: userSurname
  });
});

/*######### USERS ROUTER ##############*/

router.get('/users-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;

  console.log(req.session.admin);
  res.render('admin/users-list', { 
    title: 'Users List',
    userName: userName,
    userSurname: userSurname
  });
});

/*######### SETTINGS ROUTER ##############*/

router.get('/settings-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;

  console.log(req.session.admin);
  res.render('admin/settings-list', { 
    title: 'Settings List',
    userName: userName,
    userSurname: userSurname
  });
});

module.exports = router;