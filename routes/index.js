const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/upload', (req, res, next) => {
  res.render('newStory');
});

router.get('/story', (req, res, next) => {
  res.render('story');
});

router.post('/upload', (req, res, next) => {
  res.redirect('story');
});

router.get('/profile', (req, res, next) => {
  res.render('profile');
});



module.exports = router;
