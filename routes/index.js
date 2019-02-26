const express = require('express');

// User model
const User = require("../models/user");

// Story model
const Story = require("../models/story");

const uploadCloud = require('../config/cloudinary.js');

// Comment model
const Comment = require("../models/comments");

const router  = express.Router();

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

// router.post('/story', (req, res, next) => {
//   console.log('jhbjbjhb',req.body, req.params);
//   Story.create(req.body).then(response => {
//     res.redirect('story');
//   })
// });

router.post('/upload', uploadCloud.single('photo'), isLoggedIn, (req, res, next) => {
  const { title, description, sources} = req.body;
  const image = req.file.url;
  const user_id = req.user._id;
  console.log(req.body, req.file)
  const story = new Story({title, description, sources, image, user_id})
  story.save()
  .then(storySaved => {
    res.redirect('/');
  })
  .catch(error => {
    console.log(error);
  })
});

router.get('/profile', (req, res, next) => {
  res.render('profile');
});




function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();

  res.redirect('/login');
}

module.exports = router;
