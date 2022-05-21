const express = require('express');
const router = express.Router();

/* GET news page. */
router.get('/', (req, res, next) => {
  res.render('about', { title: 'About' });
});

module.exports = router;