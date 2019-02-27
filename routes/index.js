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

router.get('/upload', isLoggedIn, (req, res, next) => {
  res.render('upload');
});
            //y98gig8472gyu23gg
            //story/profile
router.get('/story/:watermelon', (req, res, next) => {

  Story.findOne({'_id': req.params.watermelon})
  .then(theStory => {
    console.log(444444, theStory)
    //We can find all the comments with teh story's id, theStory_id
    Comment.find({storyId:theStory._id}).then(comments => {
      res.render('story', { story: theStory, comment:comments });
    })
  })
  .catch(error => {
    console.log('Error while retrieving story: ', error);
  })
});

//post comment on story

router.post('/story/:id', isLoggedIn, (req, res, next) => {
  console.log(req.body, req.params, req.user, 'idk what is going on???')
  let storyId = req.params.id;
  let user_id = req.user._id;
  let username = req.user.username;
  let comment = req.body.comment;


  const commentToSave = new Comment({user_id, comment, storyId, username})
  commentToSave.save()
  .then(commentSaved => {
    res.redirect('back')
  })
})

//Edit story

// router.push('/story/:id', (req, res, next) =>
//   Story.findOneAndUpdate({'_id':req.params.id})
//   .then())

//delete story

router.post('/delete/:id', (req, res, next) => { //Listengin to profile.hbs for the acton 'delete/someid8787huhu'
  Story.remove({'_id': req.params.id}) //remove story by id
  .then(theStory => {
    console.log(444444, req.params.storyId)
    res.redirect('../profile');
  })
  .catch(error => {
    console.log('Error while deleting story: ', error);
  })
});

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

router.get('/profile', isLoggedIn, (req, res, next) => {
  console.log('dontthinkwe ar ehere ')
  Story.find({user_id:req.user._id}).then(userStories => { //Find all stories that belong to user
    User.findOne({'_id': req.user._id}).then(theUser => {
      Comment.find({user_id:req.user._id}).then(userComments => {
        console.log(212313,theUser, userStories)
        // console.log('Retrieved books from DB:', allTheBooksFromDB);
        res.render('profile', { user: theUser, stories:userStories, comments:userComments}); //Sent those stories to hbs file 
      })
    }).catch(error => {
      console.log('Error while getting the books from the DB: ', error);
    })
  })
});

// router.get('/movie/:id', (req, res, next) => {
//   Movie.findOne({'_id': req.params.id})
//     .then(theMovie => {
//     console.log('theMovie',theMovie)
//     console.log(req.params.movieId);
//     res.render('movie-details', { movie :theMovie })
//   })
//   .catch(error => {
//     console.log('Error while retrieving movie details: ', error);
//   })
// });

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // can't access session here
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();

  res.redirect('/login');
}

module.exports = router;
