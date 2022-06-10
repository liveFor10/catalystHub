const express = require('express');
const mongoDButils = require('../../utils/mongoDButils.js');
const { ObjectID } = require('mongodb');
const consts = require('../../config/consts.js');

const jobRouter = express.Router();

/*
 x -1.        authenticate
 x 0.         show controls without searching
 x 1. get     find all at the root
 x 2. get     find by with query params
 x 3. get     find one with an ID in the path
   4. post    create new has a body
   5. put     update whole had a body
   6. patch   update partial has body parts
   7. delete  remove with an ID in the path
*/


// -1. challenge for credentials
//TODO:  tmp disable while in development
/* jobRouter.use((req, res, next) => {
  if (req.user) {  //already logged in
    next();
  } else {
    res.redirect('/auth/signIn'); //not logged in, account possession unknown
  }
}); */

// 0. /jobs, just paint the screen
jobRouter.route('/')
  .get( (req, res) => {
    res.render('jobs');
  });

// 1. not going to do

// 2. search by params
jobRouter.route('/search') // "/jobs/search
  .get((req, res) => {
    const jobsPerPage = req.query.ipp || consts.ITEMS_PER_PAGE;
    const requestedPageNumber = req.query.rpn || consts.REQUESTED_PAGE_NUMBER;
    const sortOrderAscending = req.query.so || consts.SORT_ORDER_ASC;
    const jobFilters = mongoDButils.createMongoFiltersFromQueryParams(req.query);
    
    (async function search() {

      try {
        if (jobFilters) {
          let db = await mongoDButils.getConnectedMongoDB();

          const jobs = await db.collection('jobs')
            .find( jobFilters )
            .sort({ job : sortOrderAscending } )
            .skip( jobsPerPage * requestedPageNumber )
            .limit( jobsPerPage )
            .toArray();

          res.render( 'jobs', { jobs } );
        } else {
          res.render( 'jobs');
        }
      } catch (error) {
        console.log(`jobRouter/search error=${error}`)
      }
    }())
  });

// 3. display one:  host:port/paths/jobs/xxxxxxx
jobRouter.route('/:jobID') // "/jobs/:jobID" 
  .get((req, res) => {
    const jobID = req.params.jobID;
  
    (async function searchByID() {
      try {
        let db = await mongoDButils.getConnectedMongoDB();

        const job = await db.collection('jobs')
        .findOne({
          _id: new ObjectID(jobID)
        });
        res.render('job', { job });

      } catch (error) {
        console.log(`jobRouter/search/jobID error=${error}`)
      }
    }())
  });

// 4. create new
/*
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
*/
jobRouter.route('/') // "/jobs" because of "app.use('/jobs', jobRouter);" in app.js
  .post((req, res) => {
    const newJob = req.body;
  
    (async function createJob() {
      try {
        let db = await mongoDB.getConnectedMongoDB();
        const result = await db.collection('jobs').insertOne(newJob);

        res.render('job', { result });
      } catch (error) {
        debug(error.stack);
      }
    }())
  });
  
module.exports = jobRouter;