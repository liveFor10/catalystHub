const express = require('express');
const passport = require('passport');
const mongoDB = require('../../../database/mongoDB.js');

const authRouter = express.Router();

//1of3
authRouter.route('/signUp')  // /auth/signUp...ie register aka insert user into db
  .post((req, res) => {
    const {emailAddress, password} = req.body;
    
    (async function addUser() {
      try {
        let db = await mongoDB.getMongoDB();
        const user = {emailAddress, password}
        const insertResult = await db.collection('users').insertOne(user);
        if (result) {
          console.log('lfx ' + insertResult);
          user.insertedId = insertResult.insertedId;
          req.login(user, () => {
            res.redirect('/auth/profile');  //successful login:  go to "profile"
          })
        }

      } catch (error) {
        console.log('lfx ' + error);
      }
    } ())
  });


//2of3: attempting a login at the login page
authRouter.route('/signin')
.get((req, res) => {
  res.render('signin');
})
//success decision:  either goto profile upon success or the root of the router upon fail
.post(passport.authenticate('local', {
  successRedirect: '/auth/profile',
  failureMessage:  '/'
}));


//3of3 ie successful login:  just show user info?  BAD!
authRouter.route('/profile')  
  .get((req, res) => {
    res.render('home');
  });


module.exports = authRouter;