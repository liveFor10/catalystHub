const passport = require('passport');
const { Strategy } = require('passport-local');
const mongoDB = require('../../../database/mongoDB.js');

function localStrategy() {

  passport.use(new Strategy({
    usernameField: 'emailAddress',
    passwordField: 'password'
  }, (emailAddress, password, done) => {

    (async function validateUser(){
      try {
        let db = await mongoDB.getMongoDB();

        const user = await db.collection('users').findOne({
          emailAddress
        });
        if(user && (user.password === password)) {
          done(null, user);
        } else {
          done(null, false)
        }

      } catch (error) {
        done(error, false);
      }
    }())
  }));
}


module.exports = localStrategy;