const express = require('express');

// User model
const User = require("../models/user");

// Story model
const Story = require("../models/story");

const uploadCloud = require('../config/cloudinary.js');

// Comment model
const Comment = require("../models/comments");

const router  = express.Router();

/* GET home page 
ries  [ { _id: 5c788d9e4c830d81ffd15a28,
    title: 'Brian Flores new coach of Dolphins',
    image:
     'http://res.cloudinary.com/dlngr7ftb/image/upload/v1551382727/images/brian%20flores.jpg.jpg',
    user_id: 5c780992c630eb001766b9ea,
    created_at: 2019-03-01T01:40:46.187Z,
    updated_at: 2019-03-01T01:40:46.187Z,
    __v: 0 },
  { _id: 5c79387c31f7ad8a5f33003e,
    title: 'Tesla’s promised $35,000 Model 3 is finally here',
    image:
     'http://res.cloudinary.com/dlngr7ftb/image/upload/v1551448190/images/tesla.jpeg.jpg',
    user_id: 5c780992c630eb001766b9ea,
    created_at: 2019-03-01T13:49:48.704Z,
    updated_at: 2019-03-01T13:49:48.704Z,
    __v: 0 },
  { _id: 5c793c8f31f7ad8a5f33003f,
    title: 'Open Source Front End Bootcamp',
    image:
     'http://res.cloudinary.com/dlngr7ftb/image/upload/v1551390639/images/microsoftwindowsnewlogo-2880x1800.jpg.jpg',
    user_id: 5c780992c630eb001766b9ea,
    created_at: 2019-03-01T14:07:11.952Z,
    updated_at: 2019-03-01T14:07:11.952Z,
    __v: 0 },
  { _id: 5c793d0f31f7ad8a5f330040,
    title: 'BMW uses Blockchain',
    image:
     'http://res.cloudinary.com/dlngr7ftb/image/upload/v1551449361/images/bmw.jpeg.jpg',
    user_id: 5c780992c630eb001766b9ea,
    created_at: 2019-03-01T14:09:19.110Z,
    updated_at: 2019-03-01T14:09:19.110Z,
    __v: 0 } ]*/
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
            //y98gig8472gyu23gg
            //story/profile
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

// router.get('/story/:watermelon', (req, res, next) => {
//   Story.findOne({'_id': req.params.watermelon}).then(theStory => {
//     console.log(444444, theStory)
//     //We can find all the comments with teh story's id, theStory_id
//     Comment.find({storyId:theStory._id}).then(theUser => {
//       console.log(req.body, '666666666666666666666666666')
//       Comment.find({user_id:req.user._id}).then(comments => {
//       res.render('story', { user: theUser, story: theStory, comment:comments });
//       })
//     }).catch(error => {
//     console.log('Error while retrieving story: ', error);
//     })
//   })
// });

//post comment on story

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


















// router.post('/comment/:id/edit', (req, res, next) => {
//   console.log(req.body, req.params, 'never gets old')
//   Comment.findById(req.params.id)
//   .then(commentFromDB=>{
//     commentFromDB.comment = req.body.newComment
//     // user.comment = req.body.comment;
//     commentFromDB.save((err)=>{
//       if(!err){
//         res.json({ 'updated': true })
//       }
//     })
//   })
// })

//Edit story

// router.push('/story/:id', (req, res, next) =>
//   Story.findOneAndUpdate({'_id':req.params.id})
//   .then())

//delete story

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
