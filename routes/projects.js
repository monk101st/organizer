const express = require('express');
const router = express.Router();

/* GET news page. */
router.get('/', (req, res, next) => {
  res.render('projects', { title: 'Projects' });
});

module.exports = router;