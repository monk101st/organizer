const express = require('express');
const router = express.Router();

/* GET news page. */
router.get('/', (req, res, next) => {
  console.log(req.session);
  res.render('news', { 
    title: 'News'
 });
});

module.exports = router;