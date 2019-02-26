const express = require('express');
const router  = express.Router();
// User model
const User = require("../models/user");
// User model
const Story = require("../models/story");
// User model
const Comment = require("../models/comments");
/* GET home page */
router.get('/', (req, res, next) => {
  Story.find().then(storiesFromTheDb =>{
    console.log(storiesFromTheDb);
    res.render('index', {storiesToHBS:storiesFromTheDb});
  })
});

router.get('/upload', (req, res, next) => {
  res.render('upload');
});

router.get('/story', (req, res, next) => {
  res.render('story');
});

router.post('/story', (req, res, next) => {
  console.log('jhbjbjhb',req.body, req.params);
  Story.create(req.body).then(response => {
    res.redirect('story');
  })
});

router.get('/profile', (req, res, next) => {
  res.render('profile');
});



module.exports = router;
