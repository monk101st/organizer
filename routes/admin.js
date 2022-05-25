const express = require('express');
const router = express.Router();
const News = require('../models/news');
const Abouts = require('../models/abouts');
const Users = require('../models/users');

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
  const userAvatar = req.session.admin.sesAvatar;
  res.render('admin/index', { 
    title: 'Administration Panel',
    userName: userName,
    userSurname: userSurname,
    userAvatar: userAvatar
  });
});

/*######### GET NEWS ROUTER ##############*/

router.get('/news-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  News.find({}, (err, data) => {

    res.render('admin/news-list', { 
      title: 'News List',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data
    });
  })
});

router.get('/news/add', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  res.render('admin/news-form', {
    title: 'Dodaj news',
    userName: userName,
    userSurname: userSurname,
    userAvatar: userAvatar,
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
  const userAvatar = req.session.admin.sesAvatar;

  console.log(body);
  newsData.save((err) => {
    if(err) {
      res.render('admin/news-form', {
        title: 'Dodaj news',
        userName: userName,
        userSurname: userSurname,
        userAvatar: userAvatar,
        errors,
        body
      });
      return;
    }
    res.redirect('/admin/news-list')
  });

});

router.get('/news/delete/:id', (req, res) => {

  News.findByIdAndDelete(req.params.id, (err) => {
    res.redirect('/admin/news-list')
  })
});
/*######### ABOUT ROUTER ##############*/

router.get('/about-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  res.render('admin/about-list', { 
    title: 'About List',
    userName: userName,
    userSurname: userSurname,
    userAvatar: userAvatar,
  });
});

  router.get('/about/add', (req, res) => {
    const userName = req.session.admin.sesName;
    const userSurname = req.session.admin.sesSurname;
    const userAvatar = req.session.admin.sesAvatar;
  
    console.log(req.session.admin);
    res.render('admin/about-form', { 
      title: 'Dodaj artykuł - About',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
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
  const userAvatar = req.session.admin.sesAvatar;


  aboutsData.save((err) => {
    if(err) {
      res.render('admin/about-form', {
        title: 'Dodaj About',
        userName: userName,
        userSurname: userSurname,
        userAvatar: userAvatar,
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
  const userAvatar = req.session.admin.sesAvatar;

  console.log(req.session.admin);
  res.render('admin/project-list', { 
    title: 'Project List',
    userName: userName,
    userSurname: userSurname,
    userAvatar: userAvatar,
  });
});

/*######### QUIZES ROUTER ##############*/

router.get('/quizes-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  console.log(req.session.admin);
  res.render('admin/quizes-list', { 
    title: 'Quizes List',
    userName: userName,
    userSurname: userSurname,
    userAvatar: userAvatar,
  });
});

/*######### USERS ROUTER ##############*/

router.get('/users-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  Users.find({}, (err, data) => {

    res.render('admin/users-list', { 
      title: 'Users List',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data
    });
  })
});

router.get('/users/add', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  console.log(req.session.admin);
  res.render('admin/users-form', { 
    title: 'Dodaj użytkownika',
    userName: userName,
    userSurname: userSurname,
    userAvatar: userAvatar,
    body: {},
    errors: {}
  });

});

router.post('/users/add', (req, res) => {
  const body = req.body;

  const usersData = new Users(body);
  const errors = usersData.validateSync();
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;
  usersData.save((err) => {
    if(err) {
      res.render('admin/users-form', {
        title: 'Dodaj użytkownika',
        userName: userName,
        userSurname: userSurname,
        userAvatar: userAvatar,
        errors,
        body
      });
      return;
    }
    res.redirect('/admin/users-list')
  });

});

router.get('/users/edit/:id', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  Users.findById(req.params.id, (err, data) => {
    console.log(data);
    res.render('admin/users-edit-form', { 
      title: 'Edycja użytkownika',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
      errors:{}
    });
  })
});

router.post('/users/update', (req, res) => {
  const body = req.body;
  console.log(body);
  Users.findByIdAndUpdate(body.id, {
    nick: body.nick,
    name: body.name,
    surname: body.surname,
    email: body.email,
    password: body.password,
    avatar: body.avatar,
    created: body.created,
    adres: body.adres,
    kod: body.kod,
    city: body.city,
    phone: body.phone,
    mobile: body.mobile,
    fax: body.fax,
  }, (err) => {
    res.redirect('/admin/users-list')
  })
});

router.get('/users/delete/:id', (req, res) => {

  Users.findByIdAndDelete(req.params.id, (err) => {
    res.redirect('/admin/users-list')
  })
});

router.get('/users/show/:id', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  Users.findById(req.params.id, (err, data) => {   
    res.render('admin/users-show', { 
      title: 'Dane użytkownika',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
    });
  })
});

/*######### SETTINGS ROUTER ##############*/

router.get('/settings-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  console.log(req.session.admin);
  res.render('admin/settings-list', { 
    title: 'Settings List',
    userName: userName,
    userSurname: userSurname,
    userAvatar: userAvatar,
  });
});

module.exports = router;