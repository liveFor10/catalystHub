const passport = require('passport');
const { Strategy } = require('passport-local');
const mongoDButils = require('../../utils/mongoDButils.js');

function localStrategy() {

  passport.use(new Strategy({
    usernameField: 'emailAddress',
    passwordField: 'password'
  }, (emailAddress, password, done) => {

    (async function validateUser() {
      try {
        const db = await mongoDButils.getConnectedMongoDB();
        const user = await db.collection('users').findOne({ emailAddress });

        if ( user ) {
          if (user.password === password) {
            done(null, user, { message: `You are logged in.  Welcome back ${user.name}.` } );
          } else {
            done(null, false, { message: 'Invalid username/password combination.' } );
          }
        } else {
          done(null, false, { message: `User, ${user.emailAddress} not found.` } );
        }
      } catch (error) {
        done(error, false, { message: error } );
      }
    }())
  }));
}


module.exports = localStrategy;