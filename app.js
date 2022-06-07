var createError = require('http-errors');
var cookieSession = require('cookie-session')
var express = require('express');
var path = require('path');
const multer = require('multer');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./routes/config');
var mongoose = require('mongoose');

mongoose.connect(config.db, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log('connected...')
})

var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var newsRouter = require('./routes/news');
var projectsRouter = require('./routes/projects');
var quizRouter = require('./routes/quiz');
var galleryRouter = require('./routes/gallery');
var registerRouter = require('./routes/register');
var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
  name: 'session',
  keys: config.keySession,
  maxAge: config.maxAgeSession
}))

app.use((req, res, next) => {
  res.locals.path = req.path; //podstawienie pod zmienną globalną adresu strony linku 

  next();
})

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/news', newsRouter);
app.use('/projects', projectsRouter);
app.use('/quiz', quizRouter);
app.use('/gallery', galleryRouter);
app.use('/register', registerRouter);
app.use('/api', apiRouter);
app.use('/admin', adminRouter);

/* ############################################## */

/* var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
 
var upload = multer({
  storage: Storage,
}).single("image"); //Field name and max count
 
app.get("/", (req, res) => {
 
    imageData.exec(function(err,data){
        if(err) throw err;
 
        console.log(data)
 
        res.render('home',{records:data})
    })
}); */


/* ######################################################## */


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
