const express = require('express');
const passport = require('passport');
const mongoDButils = require('../../utils/mongoDButils.js');
const userUtils = require('../../utils/userUtils.js')

const authRouter = express.Router();

authRouter.use((req, res, next) => {

  //already a user AND logged in
  if (req.user) {  
    // specifically wanted to sign up
    if (req.originalUrl === '/auth/signup') {
      res.render('signup', {
        message: userUtils.getUserSignedUpSignedInMessage(req)
      });
    } else { 
      // forward to end destination without attempting login...unless that asset is identity protected
      next();
    }
  } else {
    //not logged in, but may be a user (that needs to (login to access the resource)
    next();
  }
});

authRouter.route('/signup') // /auth/signup...ie show the html with the controls
.get((req, res) => {
  res.render('signup');
});

authRouter.route('/signup')  // /auth/signup...ie register aka insert user into db
  .post((req, res) => {
    const {name, emailAddress, password} = req.body;
    const registrationDate = new Date().toISOString();

    (async function addUser() {
      try {
        let db = await mongoDButils.getConnectedMongoDB();
        const user = {name, emailAddress, password, registrationDate}
        const userExists = await mongoDButils.entityExistsInMongoCollection(db, 'users', emailAddress);

        if ( ! userExists ) {
          const insertOccurred = await db.collection('users').insertOne(user);
          if (insertOccurred) {
            console.log('authRouter.post.addUser.insertOccurred=' + JSON.stringify(insertOccurred));
            user.insertedId = insertOccurred.insertedId;
            req.login(user, () => {
              res.render('home', {
                message: `Your account has been created AND you are logged in, '${name}.'`
              });
            })
          } else {
            res.redirect('/auth/signup', {
              message: `A user account did not get created.  We're a WIP.  Please use the Contact Us to allow us to assist you.`
            });
          }
        } else {
          res.render('signup', {
            message: `User with email address '${emailAddress}' already exists.`,
            user: user
          });
        }
      } catch (error) {
        res.redirect('/auth/signup', {
          message: `We apologize.  An error, '${error}' occurred.  Rest assured, we're already working on it.`
        });
      }
    } ())
  });

authRouter.route('/signin')  // "/auth/signin", show login page 
  .get((req, res) => {
    res.render('signin');
  })
  // evaluate login attempt 
  .post(passport.authenticate('local', {
        successRedirect: '/',
        successMessage: true,
        successFlash: true,
        failureRedirect: '/auth/signin',
        failureMessage:  true,
        failureFlash: true
      }
  ));

authRouter.route('/logout')  // /auth/logout
  .get((req, res) => {
    req.logout();
    res.render('home', { message: `You are logged out.  Thanks for visiting.` } );
  });


module.exports = authRouter;