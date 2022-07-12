const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const News = require('../models/news');
const Abouts = require('../models/abouts');
const Users = require('../models/users');
const Projects = require('../models/projects');
const Media = require('../models/media');
const Gallerys = require('../models/gallerys');

router.all('*', (req, res, next) => {
  if(!req.session.admin) {
    res.redirect('/login');

    return;
  }

  next();
});


/* ------ Storage do Media */
var mediaStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images/media");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
 
var uploadMedia = multer({
  storage: mediaStorage,
}).single("image"); //Field name and max count

/* --------------------- End Storage----------------- */

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

  const search = req.query.search || '';
  const findNews = News
  .find({title: new RegExp(search.trim(), 'i')})
  .sort({created: -1});


  findNews.exec((err, data) => {
    res.render('admin/news-list', { 
      title: 'News List',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
      search
    });
  })

})


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

  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  uploadMedia(req, res, function (err) {
    const body = req.body;
    const file = req.file

    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {

  const newsData = new News({
    title: body.title,
    category: body.category,
    author: body.author,
    description: body.description,
    articleText: body.articleText,
    picture: file.filename,
  });
  const errors = newsData.validateSync();

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
    }
  });
});

router.get('/news/edit/:id', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  News.findById(req.params.id, (err, data) => {
    console.log(data);
    res.render('admin/news-edit-form', { 
      title: 'Edycja użytkownika',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
      errors:{}
    });
  });
  
});

router.post('/news/update', (req, res) => {
  uploadMedia(req, res, function (err) {
    const body = req.body;
    const file = req.file;
    
    console.log(file);
    console.log(body);
    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {
      
      if (file !== undefined) {
          console.log(req.file.path);
          console.log(req.file.oldpicture);

          if(req.body.oldpicture !== undefined  && req.body.oldpicture !== 'nopicture') {
            const path = `/images/media/${body.oldpicture}`;
            console.log(path);
            fs.unlinkSync("public"+path);
            News.findByIdAndUpdate(body.id, {
              title: body.title,
              category: body.category,
              author: body.author,
              picture: file.filename,
              description: body.description,
              articleText: body.articleText,
            }, (err) => {
              res.redirect('/admin/news-list')
            })
          }else if(req.body.oldpicture === 'nopicture'){
            News.findByIdAndUpdate(body.id, {
              title: body.title,
              category: body.category,
              author: body.author,
              picture: file.filename,
              description: body.description,
              articleText: body.articleText,
            }, (err) => {
              res.redirect('/admin/news-list')
            })
          }else {
            News.findByIdAndUpdate(body.id, {
              title: body.title,
              category: body.category,
              author: body.author,
              description: body.description,
              articleText: body.articleText,
            }, (err) => {
              res.redirect('/admin/news-list')
            })
          }
      }else {
          News.findByIdAndUpdate(body.id, {
            title: body.title,
            category: body.category,
            author: body.author,
            description: body.description,
            articleText: body.articleText,
          }, (err) => {
            res.redirect('/admin/news-list')
          })
      }
}
});

});

router.post('/news/delete/', (req, res) => {

  console.log(req.body);

  if (req.body.picture !== 'undefined') {

    const path = `/images/media/${req.body.picture}`;
    fs.unlinkSync("public"+path);
    News.findByIdAndDelete(req.body.id, (err) => {
      res.redirect('/admin/news-list')
      
    })
  }else {
    News.findByIdAndDelete(req.body.id, (err) => {
      res.redirect('/admin/news-list')
    })
  }
});

router.get('/news/show/:id', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  News.findById(req.params.id, (err, data) => {
    res.render('admin/news-show', { 
      title: 'Podgląd artykułu',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
      errors:{}
    });
  });
});
/*######### ABOUT ROUTER ##############*/


router.get('/about-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  const search = req.query.search || '';
  const findAbouts = Abouts
  .find({title: new RegExp(search.trim(), 'i')})
  .sort({created: -1});


  findAbouts.exec((err, data) => {
    res.render('admin/about-list', { 
      title: 'About List',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
      search
    });
  })
})

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
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;
  
  uploadMedia(req, res, function (err) {
    const body = req.body;
    const file = req.file

    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {


  const aboutsData = new Abouts({
    title: body.title,
    author: body.author,
    description: body.description,
    articleText: body.articleText,
    picture: file.filename,
  });
  const errors = aboutsData.validateSync();


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
  }
})
});

router.get('/abouts/edit/:id', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  Abouts.findById(req.params.id, (err, data) => {
    console.log(data);
    res.render('admin/about-edit-form', { 
      title: 'Edycja artykułu About',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
      errors:{}
    });
  })
});
router.post('/abouts/update', (req, res) => {
  uploadMedia(req, res, function (err) {
    const body = req.body;
    const file = req.file;
    
    console.log(file);
    console.log(body);
    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {
      
      if (file !== undefined) {


          if(req.body.oldpicture !== undefined && req.body.oldpicture !== 'nopicture') {
            const path = `/images/media/${body.oldpicture}`;
            console.log(path);
            fs.unlinkSync("public"+path);
            Abouts.findByIdAndUpdate(body.id, {
              title: body.title,
              author: body.author,
              picture: file.filename,
              description: body.description,
              articleText: body.articleText,
            }, (err) => {
              res.redirect('/admin/about-list')
            })
          }else if(req.body.oldpicture === 'nopicture'){
            Abouts.findByIdAndUpdate(body.id, {
              title: body.title,
              author: body.author,
              picture: file.filename,
              description: body.description,
              articleText: body.articleText,
            }, (err) => {
              res.redirect('/admin/about-list')
            })
          }else {
            Abouts.findByIdAndUpdate(body.id, {
              title: body.title,
              author: body.author,
              description: body.description,
              articleText: body.articleText,
            }, (err) => {
              res.redirect('/admin/about-list')
            })
          }
          }else {
            Abouts.findByIdAndUpdate(body.id, {
              title: body.title,
              author: body.author,
              description: body.description,
              articleText: body.articleText,
            }, (err) => {
              res.redirect('/admin/about-list')
            })
          }
}
});

});

/* ---------------------------------------------------------- */

router.post('/abouts/delete/', (req, res) => {

  console.log(req.body);

  if (req.body.picture !== 'undefined') {

    const path = `/images/media/${req.body.picture}`;
    fs.unlinkSync("public"+path);
    Abouts.findByIdAndDelete(req.body.id, (err) => {
      res.redirect('/admin/about-list')      
    })
  }else {
    Abouts.findByIdAndDelete(req.body.id, (err) => {
      res.redirect('/admin/about-list')
    })
  }
});

router.get('/abouts/show/:id', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  Abouts.findById(req.params.id, (err, data) => {
    res.render('admin/about-show', { 
      title: 'Podgląd Abouts',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
      errors:{}
    });
  });
});

/*############# PROJECT ROUTER ##############*/

router.get('/project-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  const search = req.query.search || '';
  const findProjects = Projects
  .find({title: new RegExp(search.trim(), 'i')})
  .sort({created: -1});

  findProjects.exec((err, data) => {
    res.render('admin/project-list', { 
      title: 'Project List',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
      search
    });
  })
})

router.get('/project/add', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;


  res.render('admin/project-form', { 
    title: 'Dodaj projekt',
    userName: userName,
    userSurname: userSurname,
    userAvatar: userAvatar,
    body: {},
    errors: {}
  });
});

router.post('/project/add', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;
  
  uploadMedia(req, res, function (err) {
    const body = req.body;
    const file = req.file

    

    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {

      if (file !== undefined) {
        const projectsData = new Projects({
          title: body.title,
          author: body.author,
          description: body.description,
          articleText: body.articleText,
          technology: [
            javascript = body.javascript,
            react = body.react,
            css = body.css,
            bootstrap = body.bootstrap,
            html = body.html,
            jquerry = body.jquerry,
          ],
          picture: file.filename,
        });
        const errors = projectsData.validateSync();
      
      
        projectsData.save((err) => {
            if(err) {
              res.render('admin/project-form', {
                title: 'Dodaj About',
                userName: userName,
                userSurname: userSurname,
                userAvatar: userAvatar,
                errors,
                body
              });
              return;
            }
            res.redirect('/admin/project-list')
          });
      } else {
        const projectsData = new Projects({
          title: body.title,
          author: body.author,
          description: body.description,
          articleText: body.articleText,
          technology: [
            javascript = body.javascript,
            react = body.react,
            css = body.css,
            bootstrap = body.bootstrap,
            html = body.html,
            jquerry = body.jquerry,
          ],
          picture: 'nobanner.jpg',
        });
        const errors = projectsData.validateSync();
      
      
        projectsData.save((err) => {
            if(err) {
              res.render('admin/project-form', {
                title: 'Dodaj About',
                userName: userName,
                userSurname: userSurname,
                userAvatar: userAvatar,
                errors,
                body
              });
              return;
            }
            res.redirect('/admin/project-list')
          });
      }
      


  }
})
});

router.get('/projects/edit/:id', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  Projects.findById(req.params.id, (err, data) => {
    console.log(data);
    res.render('admin/projects-edit-form', { 
      title: 'Edycja projektu',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
      errors:{}
    });
  });
});

router.post('/projects/update', (req, res) => {
  uploadMedia(req, res, function (err) {
    const body = req.body;
    const file = req.file;
    
    console.log(file);
    console.log(body);
    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {
      
      if (file !== undefined) {


          if(req.body.oldpicture !== undefined && req.body.oldpicture !== 'nopicture') {
            const path = `/images/media/${body.oldpicture}`;
            console.log(path);
            fs.unlinkSync("public"+path);
            Projects.findByIdAndUpdate(body.id, {
              title: body.title,
              author: body.author,
              picture: file.filename,
              description: body.description,
            }, (err) => {
              res.redirect('/admin/project-list')
            })
          }else if(req.body.oldpicture === 'nopicture'){
            Projects.findByIdAndUpdate(body.id, {
              title: body.title,
              author: body.author,
              picture: file.filename,
              description: body.description,
            }, (err) => {
              res.redirect('/admin/project-list')
            })
          }else {
            Projects.findByIdAndUpdate(body.id, {
              title: body.title,
              author: body.author,
              description: body.description,
            }, (err) => {
              res.redirect('/admin/project-list')
            })
          }
      }else {
        Projects.findByIdAndUpdate(body.id, {
          title: body.title,
          author: body.author,
          description: body.description,
        }, (err) => {
          res.redirect('/admin/project-list')
        })
      }
    }
});

});


router.post('/projects/delete/', (req, res) => {

  console.log(req.body);

  if (req.body.picture !== 'undefined' && req.body.picture !== 'nobanner.jpg') {

    const path = `/images/media/${req.body.picture}`;
    fs.unlinkSync("public"+path);
    Projects.findByIdAndDelete(req.body.id, (err) => {
      res.redirect('/admin/project-list')      
    })
  }else {
    Projects.findByIdAndDelete(req.body.id, (err) => {
      res.redirect('/admin/project-list')
    })
  }
});

router.get('/projects/show/:id', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  Projects.findById(req.params.id, (err, data) => {   
    res.render('admin/project-show', { 
      title: 'Dane projektu',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
    });
  })
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

  const search = req.query.search || '';
  const findUsers = Users
  .find({nick: new RegExp(search.trim(), 'i')})
  .sort({created: -1});


  findUsers.exec((err, data) => {
    res.render('admin/users-list', { 
      title: 'Users List',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
      search
    });
  })
})


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
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;
  
  uploadMedia(req, res, function (err) {
    const body = req.body;
    const file = req.file

    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {

      if (file !== undefined) {
        const usersData = new Users({
          nick: body.nick,
          name: body.name,
          surname: body.surname,
          email: body.email,
          password: body.password,
          rulacc: body.rulacc,
          avatar: file.filename,
          adres: body.adres,
          kod: body.kod,
          city: body.city,
          phone: body.phone,
          mobile: body.mobile,
          fax: body.fax,
        });
        const errors = usersData.validateSync();
      
        usersData.save((err) => {
            if(err) {
              res.render('admin/users-form', {
                title: 'Dodaj Użytkownika',
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
      } else {
        const usersData = new Users({
          nick: body.nick,
          name: body.name,
          surname: body.surname,
          email: body.email,
          password: body.password,
          rulacc: body.rulacc,
          avatar: 'nopicture.jpg',
          adres: body.adres,
          kod: body.kod,
          city: body.city,
          phone: body.phone,
          mobile: body.mobile,
          fax: body.fax,
        });
        const errors = usersData.validateSync();
      
      
        usersData.save((err) => {
            if(err) {
              res.render('admin/users-form', {
                title: 'Dodaj Użytkownika',
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
      }
      }
    })
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
  });
});


router.post('/users/update', (req, res) => {
  uploadMedia(req, res, function (err) {
    const body = req.body;
    const file = req.file;
    
    console.log(file);
    console.log(body);
    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {
      
      if (file !== undefined) {


          if(req.body.oldpicture !== undefined && req.body.oldpicture !== 'nopicture') {
            const path = `/images/media/${body.oldpicture}`;
            console.log(path);
            fs.unlinkSync("public"+path);
            Users.findByIdAndUpdate(body.id, {
              nick: body.nick,
              name: body.name,
              surname: body.surname,
              email: body.email,
              password: body.password,
              avatar: file.filename,
              adres: body.adres,
              kod: body.kod,
              city: body.city,
              phone: body.phone,
              mobile: body.mobile,
              fax: body.fax,
            }, (err) => {
              res.redirect('/admin/users-list')
            })
          }else if(req.body.oldpicture === 'nopicture'){
            Users.findByIdAndUpdate(body.id, {
              nick: body.nick,
              name: body.name,
              surname: body.surname,
              email: body.email,
              password: body.password,
              avatar: file.filename,
              adres: body.adres,
              kod: body.kod,
              city: body.city,
              phone: body.phone,
              mobile: body.mobile,
              fax: body.fax,
            }, (err) => {
              res.redirect('/admin/users-list')
            })
          }else {
            Users.findByIdAndUpdate(body.id, {
              nick: body.nick,
              name: body.name,
              surname: body.surname,
              email: body.email,
              password: body.password,
              adres: body.adres,
              kod: body.kod,
              city: body.city,
              phone: body.phone,
              mobile: body.mobile,
              fax: body.fax,
            }, (err) => {
              res.redirect('/admin/users-list')
            })
          }
      }else {
        Users.findByIdAndUpdate(body.id, {
          nick: body.nick,
          name: body.name,
          surname: body.surname,
          email: body.email,
          password: body.password,
          adres: body.adres,
          kod: body.kod,
          city: body.city,
          phone: body.phone,
          mobile: body.mobile,
          fax: body.fax,
        }, (err) => {
          res.redirect('/admin/users-list')
        })
      }
}
});

});


router.post('/users/delete/', (req, res) => {

  console.log(req.body);

  if (req.body.picture !== 'undefined' && req.body.picture !== 'nopicture.jpg') {

    const path = `/images/media/${req.body.picture}`;
    fs.unlinkSync("public"+path);
    Users.findByIdAndDelete(req.body.id, (err) => {
      res.redirect('/admin/users-list')      
    })
  }else {
    Users.findByIdAndDelete(req.body.id, (err) => {
      res.redirect('/admin/users-list')
    })
  }
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

/*######### MEDIA ROUTER ##############*/

router.get('/media-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  const search = req.query.search || '';
  const findMedia = Media
  .find({title: new RegExp(search.trim(), 'i')})
  .sort({created: -1});


  findMedia.exec((err, data) => {
    res.render('admin/media-list', { 
      title: 'Media List',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
      search
    });
  })

})

router.get('/media/add', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;
  const gallerysData = Gallerys.find({})

  gallerysData.exec(function(err,galdata){

    console.log(galdata)

  res.render('admin/media-form', { 
    title: 'Dodawanie plików',
    userName: userName,
    userSurname: userSurname,
    userAvatar: userAvatar,
    galdata,
    data: {},
    errors: {}
  });
})

});

router.post("/media/add", (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;
  const mediaData = Media.find({})
  const gallerysData = Gallerys.find({})
  
  
  uploadMedia(req, res, function (err) {
    console.log(req.file);
    console.log(req.body);
    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {
      console.log(req.file.path);
      var mediaName = req.file.filename;
      var mediaTitle = req.body.title;
      var mediaGallery = req.body.gallery;
      var mediaDate = req.body.date;
      var mediaAuthor = req.body.author;
      var mediaDescription = req.body.description;
 
      var mediaDetails = new Media({
        title: mediaTitle,
        gallery: mediaGallery,
        filename: mediaName,
        date: mediaDate,
        author: mediaAuthor,
        description: mediaDescription,
      });
 
        mediaDetails.save(function (err, doc) {
          if (err) throw err;
  
          console.log("Image Saved");
  
            mediaData.exec(function(err,data){
                if(err) throw err;


                    res.render('admin/media-form', {
                      title: 'Dodawanie plików',
                      userName: userName,
                      userSurname: userSurname,
                      userAvatar: userAvatar,
                      data,
                      errors: {},
                      success:true})
                })
            });
         }
    });
});

router.get('/media/edit/:id', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;
  console.log(req.params.id);

  const gallerysData = Gallerys.find({})

  Media.findById(req.params.id, (err, data) => {

    gallerysData.exec(function(err,galdata){
    res.render('admin/media-edit-form', { 
      title: 'Edycja pliku',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
      galdata,
      errors:{}
    })
    });
  });
});

router.post('/media/update', (req, res) => {
  console.log(req);
  uploadMedia(req, res, function (err) {
    const body = req.body;
    const file = req.file;
    
    console.log(file);
    console.log(body);
    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {
      
      if (file !== undefined) {
          console.log(req.file.path);

          Media.findByIdAndUpdate(req.body.id, {
          title: body.title,
          gallery: body.gallery,
          filename: file.filename,
          author: body.author,
          description: body.description,
        }, (err) => {
          res.redirect('/admin/media-list')
        })
      }else {
          Media.findByIdAndUpdate(req.body.id, {
            title: body.title,
            gallery: body.gallery,
            author: body.author,
            description: body.description,
          }, (err) => {
            res.redirect('/admin/media-list')
          })
      }

}
});

})

router.post('/media/delete/', (req, res) => {
  const body = req.body;

  const path = `/images/media/${body.filename}`;

  console.log(path);

  fs.unlinkSync("public"+path);

  Media.findByIdAndDelete(body.id, (err) => {
    res.redirect('/admin/media-list')
  })
});


/* #########-GALLERY ROUTER-############### */

router.get('/gallerys-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  const gallerysData = Gallerys.find({})

  gallerysData.exec(function(err,data){
      if(err) throw err;


    res.render('admin/gallerys-list', { 
      title: 'Gallerys List',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data
    });
  });
});

router.get('/media/addgallery', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;

  console.log(req.session.admin);
  res.render('admin/gallerys-form', { 
    title: 'Dodaj galerię',
    userName: userName,
    userSurname: userSurname,
    userAvatar: userAvatar,
    body: {},
    errors: {}
  });

});

router.post('/media/addgallery', (req, res) => {
  const body = req.body;

  const gallerysData = new Gallerys(body);
  const errors = gallerysData.validateSync();
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;
  gallerysData.save((err) => {
    if(err) {
      res.render('admin/gallerys-form', {
        title: 'Dodaj użytkownika',
        userName: userName,
        userSurname: userSurname,
        userAvatar: userAvatar,
        errors,
        body
      });
      return;
    }
    res.redirect('/admin/gallerys-list')
  });

});

router.get('/media/editgallery/:id', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;
  console.log(req.params.id);

  Gallerys.findById(req.params.id, (err, data) => {

    res.render('admin/gallerys-edit-form', { 
      title: 'Edycja pliku',
      userName: userName,
      userSurname: userSurname,
      userAvatar: userAvatar,
      data,
      errors:{}
    });
  });
});

router.post('/media/updategallery', (req, res) => {
  const body = req.body;
  console.log(body.id);
  Gallerys.findByIdAndUpdate(body.id, {
    title: body.title,
    description: body.description,
  }, (err) => {
    res.redirect('/admin/gallerys-list')
  })
});

router.get('/media/deletegallery/:id', (req, res) => {

  Gallerys.findByIdAndDelete(req.params.id, (err) => {
    res.redirect('/admin/gallerys-list')
  })
});
/*######### SETTINGS ROUTER ##############*/

router.get('/settings-list', (req, res) => {
  const userName = req.session.admin.sesName;
  const userSurname = req.session.admin.sesSurname;
  const userAvatar = req.session.admin.sesAvatar;


  res.render('admin/settings-list', { 
    title: 'Settings List',
    userName: userName,
    userSurname: userSurname,
    userAvatar: userAvatar,
  });
});

module.exports = router;