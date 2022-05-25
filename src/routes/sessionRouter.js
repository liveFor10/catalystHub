const express = require('express');
const debug = require('debug')('app:sessionRouter');
const { MongoClient, ObjectID } = require('mongodb');

const sessionsRouter = express.Router();

sessionsRouter.use((req, res, next) => {
  if (req.user) {
      next();
  } else {
    res.redirect('/auth/signin');
  }
})

sessionsRouter.route('/') //"find all"
  .get((req, res) => {

    const url = 'mongodb+srv://admin:adminASDpoi)(*123@mdbcluster00.ezr4k.mongodb.net?retryWrites=true&w=majority';
      const catalystDB = 'catalystDB';
      
      (async function mongo(){
        let mongoClient;
        try {
          mongoClient = await MongoClient.connect(url);
          debug('connected mongoDB');
          
          const db = mongoClient.db(catalystDB)

          const sessions = await db.collection('sessions').find().toArray();
          res.render('sessions', { sessions });

        } catch (error) {
          debug(error.stack);
        }
        mongoClient.close();
      }())
  });

sessionsRouter.route('/:sessionID')
  .get((req, res) => {
    const sessionID = req.params.sessionID;
    
    const url = 'mongodb+srv://admin:adminASDpoi)(*123@mdbcluster00.ezr4k.mongodb.net?retryWrites=true&w=majority';
    const catalystDB = 'catalystDB';
    
    (async function mongo(){
      let mongoClient;
      try {
        mongoClient = await MongoClient.connect(url);
        debug('connected mongoDB');
        
        const db = mongoClient.db(catalystDB)

        const session = await db.collection('sessions').findOne({
          _id: new ObjectID(sessionID)
        });
        res.render('session', { session });

      } catch (error) {
        debug(error.stack);
      }
      mongoClient.close();
    }())
  });


  module.exports = sessionsRouter;