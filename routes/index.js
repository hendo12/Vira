const express = require('express');

// User model
const User = require("../models/user");

// Story model
const Story = require("../models/story");

const uploadCloud = require('../config/cloudinary.js');

// Comment model
const Comment = require("../models/comments");

const router  = express.Router();

router.get('/', (req, res, next) => {
  console.log('in home route ', req.query)
  Story.find().then(storiesFromTheDb =>{
    console.log('all the stories ',storiesFromTheDb)
    var filteredData = storiesFromTheDb;
    if(req.query.search){
    filteredData = storiesFromTheDb.filter(function(obj) {
      return obj.title.toLowerCase().includes(req.query.search.toLowerCase())
    });
  }
    res.render('index', {storiesToHBS:filteredData});
  })
});

router.get('/upload', isLoggedIn, (req, res, next) => {
  res.render('upload');
});
   
router.get('/story/:watermelon', isLoggedIn, (req, res, next) => {
  Story.findOne({'_id': req.params.watermelon}).then(theStory => {
    //We can find all the comments with teh story's id, theStory_id
    Comment.find({storyId:theStory._id}).then(theUser => {
      Comment.find({user_id:req.user._id}).populate('user_id').then(allComments => {
      res.render('story', { user: theUser, story: theStory, allComments:allComments });
      })
    }).catch(error => {
    console.log('Error while retrieving story: ', error);
    })
  })
});

router.post('/story/:id', isLoggedIn, (req, res, next) => {
  //console.log(req.body, req.params, req.user, 'idk what is going on???')
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

router.post('/comment/:id/edit', (req, res, next) => {
  Comment.findById(req.params.id)
  .then(commentFromTheDB => {
    commentFromTheDB.comment = req.body.newComment
    commentFromTheDB.save((err) => {
      if(!err){
        res.json('updated' == true);
      }
    })
  })
})

router.post('/delete/:id', (req, res, next) => { //Listengin to profile.hbs for the acton 'delete/someid8787huhu'
  Story.remove({'_id': req.params.id}) //remove story by id
  .then(theStory => {
    Comment.remove({'_id':req.params.id})
    .then(theComment => { 
      res.redirect('../profile');
    })
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
  story.save().then(storySaved => {
    res.redirect('/');
  })
  .catch(error => {
    console.log(error);
  })
});

router.get('/profile', isLoggedIn, (req, res, next) => {
  //console.log('dontthinkwe ar ehere ')
  Story.find({user_id:req.user._id}).then(userStories => { //Find all stories that belong to user
    User.findOne({'_id': req.user._id}).then(theUser => {
      Comment.find({user_id:req.user._id}).then(userComments => {
        //console.log(212313,theUser, userStories)
        // console.log('Retrieved books from DB:', allTheBooksFromDB);
        res.render('profile', { user: theUser, stories:userStories, comments:userComments}); //Sent those stories to hbs file 
      })
    }).catch(error => {
      console.log('Error while getting the books from the DB: ', error);
    })
  })
});

router.post('/profile', uploadCloud.single('photo'), isLoggedIn, (req, res, next) => {
  console.log(req.body, req.file)
  const profileImageURL = req.file.url; //read the error couldnt read property url of undefined 
  const user_id = req.user._id;
  User.findOne({_id: req.user._id}).then(theUser => { //found user by id 
    console.log(theUser)
    theUser.avatarURL = profileImageURL; //referencing avatarurl in user objet and setting equal to new image
    theUser.save(()=>{    //save new image
      res.redirect('back')
    })
  })
  .catch(error => {
    console.log(error);
  })
});

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
