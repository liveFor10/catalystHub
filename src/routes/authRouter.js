const express = require('express');
const debug = require('debug')('app:sessionRouter');
const { MongoClient, ObjectID } = require('mongodb');
const passport = require('passport');

const authRouter = express.Router();

//1of3
authRouter.route('/signUp')
  .post((req, res) => {
    const {emailAddress, password} = req.body;
    const url = 'mongodb+srv://admin:adminASDpoi)(*123@mdbcluster00.ezr4k.mongodb.net?retryWrites=true&w=majority';
    const catalystDB = 'catalystDB';
    
    (async function addUser() {
      let mongoClient;
      try {
        mongoClient = await MongoClient.connect(url);
        debug('connected mongoDB');
        const db = mongoClient.db(catalystDB)
        const user = {emailAddress, password, local: 'value'}
        const results = await db.collection('users').insertOne(user);
        debug(results);
        user.insertedId = results.insertedId;
        req.login(user, () => {
          res.redirect('/auth/profile');
        })
      } catch (error) {
        debug(error);
      }
      mongoClient.close();
    } ())
  });

authRouter.route('/signin')
.get((req, res) => {
  res.render('signin');
})
.post(passport.authenticate('local', {
  successRedirect: '/auth/profile',
  failureMessage:  '/'
}));

authRouter.route('/profile')  //3of3
  .get((req, res) => {
    res.json(req.user);
  });


module.exports = authRouter;