const express = require('express');
const router = express.Router();
const Projects = require('../models/projects');
/* GET news page. */
router.get('/', (req, res, next) => {

  const search = req.query.search || '';

  const findProjects = Projects
  .find({title: new RegExp(search.trim(), 'i')})
  .sort({created: -1});

  findProjects.exec((err, data) => {

    res.render('projects', {
      title: 'Projects',
      data,
      search
    })
  }) 
});

router.get('/show/:id', (req, res, next) => {

  Projects.findById(req.params.id, (err, data) => {

    const dataCounter = data.counter + 1;

    Projects.findByIdAndUpdate(data.id, {counter: dataCounter}, (err) => {
      
      res.render('project-show', { 
        data,
      });
      console.log(data.counter);
    })
  })

});

module.exports = router;