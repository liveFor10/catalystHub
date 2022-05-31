const express = require('express');
const debug = require('debug')('app:jobRouter');
const { MongoClient, ObjectID } = require('mongodb');
const mongoDB = require('../../../database/mongoDB.js');

const jobRouter = express.Router();

jobRouter.use((req, res, next) => {
  if (req.user) {
      next();
  } else {
    res.redirect('/auth/signin');
  }
})

//   createnew    const book = new Book(req.body);...
//   delete       Book.findById... & book.remove((err) => {...
// x findOne      Book.findById...
// x findAll      Object.entries(req.query).forEach...  Book.find...
//   findW/Fltr   Object.entries(req.query).forEach... & Book.find(query, (err, books) => {...
//   updatePart   .patch...  Book.findById... Object.entries(req.body).forEach...book.save
//   updateWhol   .put... Book.findById...  book.x = req.body.x...  book.y = req.body.y...  book.save...

//FIND ALL
jobRouter.route('/') // "/jobs" because of "app.use('/jobs', jobRouter);" in app.js
  .get((req, res) => {
    
    (async function mongo(){
      let mongoClient;
      try {
        let db = await mongoDB.getMongoDB();

        const jobs = await db.collection('jobs').find().toArray();
        res.render('jobs', { jobs });

      } catch (error) {
        debug(error.stack);
      }
    }())
  });

//FIND ONE
jobRouter.route('/:jobID') // "/jobs" because of "app.use('/jobs', jobRouter);" in app.js
  .get((req, res) => {
    const jobID = req.params.jobID;
  
    (async function mongo(){
      try {
        let db = await mongoDB.getMongoDB();

        const job = await db.collection('jobs').findOne({
          _id: new ObjectID(jobID)
        });
        res.render('job', { job });

      } catch (error) {
        debug(error.stack);
      }
    }())
  });

//CREATE NEW
jobRouter.route('/') // "/jobs" because of "app.use('/jobs', jobRouter);" in app.js
  .post((req, res) => {
    const newJob = req.body;
  
    (async function mongo(){
      try {
        let db = await mongoDB.getMongoDB();
        const job = await db.collection('jobs').insertOne(newJob);

        res.render('job', { job });
      } catch (error) {
        debug(error.stack);
      }
    }())
  });


module.exports = jobRouter;