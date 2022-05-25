const express = require('express');
const debug = require('debug')('app:adminRouter');
const { MongoClient } = require('mongodb');

const sessionsData = require('../../gitIgnore/sessions.json');

const adminRouter = express.Router();

adminRouter.route('/')
  .get((req, res) => {
      const url = 'mongodb+srv://admin:adminASDpoi)(*123@mdbcluster00.ezr4k.mongodb.net?retryWrites=true&w=majority';
      const catalystDB = 'catalystDB';
      
      (async function mongo(){
        let mongoClient;
        try {
          mongoClient = await MongoClient.connect(url);
          debug('connected mongoDB');
          
          const db = mongoClient.db(catalystDB)

          const response = await db.collection('sessions').insertMany(sessionsData);
          res.json(response);

        } catch (error) {
          debug(error.stack);
        }
        mongoClient.close();
      }())
  });

  adminRouter.route('/:sessionID')
  .get((req, res) => {
    const sessionID = req.params.sessionID;
    res.render('session', {
      session: sessionsData[sessionID]
    });
  });


  module.exports = adminRouter;