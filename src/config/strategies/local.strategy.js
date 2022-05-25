const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient, ObjectID } = require('mongodb');

function localStrategy() {

  passport.use(new Strategy({
    usernameField: 'emailAddress',
    passwordField: 'password'
  }, (emailAddress, password, done) => {

    const url = 'mongodb+srv://admin:adminASDpoi)(*123@mdbcluster00.ezr4k.mongodb.net?retryWrites=true&w=majority';
    const catalystDB = 'catalystDB';

    (async function validateUser(){
      let mongoClient;
      try {
        mongoClient = await MongoClient.connect(url);
        const db = mongoClient.db(catalystDB)

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
      mongoClient.close();
    }())
  }));
}


module.exports = localStrategy;