const express = require('express');
const mongoDButils = require('../../utils/mongoDButils.js');
const { ObjectID } = require('mongodb');

const employerRouter = express.Router();

/*
 x -1.        authenticate
 x 0. get     displays controls
 x 1. post    creates new
   -----LATER-----
   2. put
   3. patch
   4. delete
*/


// -1. challenge for credentials
employerRouter.use((req, res, next) => {
  if (req.user) {  //already logged in
    next();
  } else {
    res.redirect('/auth/signIn'); //not logged in
  }
});

// 0. displays controls allow data entry
employerRouter.route('/')
  .get( (req, res) => {
    res.render('employ');
  });

// 1. save button creates new
employerRouter.route('/')
  .post((req, res) => {
    const newJob = req.body;
    const user = req.user;  //assumes one is logged in
    
    newJob.submittedByID = user._id;
    newJob.submittedByName = user.name;
		newJob.submittedByEmail = user.emailAddress;
		//newJob.submittedByPhone = user.phoneNumber;
    newJob.submittedOnDate= (new Date()).toLocaleDateString('en-US');
		
    (async function createJob() {
      try {
        const db = await mongoDButils.getConnectedMongoDB();
        //TODO:  check to see if job exists
  
        //if it doesn't
          const insertOccurred = await db.collection('jobs').insertOne(newJob);
          if (insertOccurred) {
            console.log('employRouter.post.createJob.insertOccurred=' + JSON.stringify(insertOccurred));
            const jobID = insertOccurred.insertedId;
            const job = await db.collection('jobs').findOne(
              {
                _id: new ObjectID(jobID)
              }
            );
            res.render('job', { job } ); //res.render(`/job/${insertOccurred.insertedId}`); 
          }
      } catch (error) {
        console.log(`employerRouter/post error=${JSON.stringify(error)}`)
      }
    }())
  });
  
module.exports = employerRouter;