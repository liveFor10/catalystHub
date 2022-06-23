const express = require('express');
const mongoDButils = require('../../utils/mongoDButils.js');
const { ObjectID } = require('mongodb');
const consts = require('../../config/consts.js');

const jobRouter = express.Router();

/*
 x -1.        authenticate
 x 0.         display controls
 x 1. get     search with query params/display multiple
 x 2. get     display one
*/


// -1. challenge for credentials
jobRouter.use((req, res, next) => {
  if (req.user) {  //already logged in
    next();
  } else {
    res.redirect('/auth/signIn'); //not logged in
  }
});

// 0. paint the search controls
jobRouter.route('/')
  .get( (req, res) => {
    res.render( 'jobs');
  });

// 1. search for/display results
jobRouter.route('/search')
  .get( (req, res) => {
    try {
      const maxJobsPerQuery = consts.MAX_ITEMS_PER_QUERY;
      const jobsPerPage = req.query.ipp || consts.ITEMS_PER_PAGE;
      let queryLimit; 
      const requestedPageNumber = req.query.rpn || consts.REQUESTED_PAGE_NUMBER;
      const sortOrderAscending = req.query.so || consts.SORT_ORDER_ASC;
      const jobFilters = mongoDButils.createMongoFiltersFromQueryParams(req.query);


      queryLimit = maxJobsPerQuery < jobsPerPage ? jobsPerPage : maxJobsPerQuery; 
      
      (async function searchJobsByNonIDcriteria() {
        const db = await mongoDButils.getConnectedMongoDB();
        const jobs = await db.collection('jobs')
          .find( jobFilters )
          .sort({ job : sortOrderAscending } )
          .skip( jobsPerPage * requestedPageNumber )
          .limit( queryLimit )
          .toArray();
        if (jobs) {
          res.render( 'jobs', { jobs: jobs } );
        } else {
          res.render( 'jobs');
        }
      }())
    } catch (error) {
      console.log(`jobRouter/search error=${JSON.stringify(error)}`);
    }
  });

// 2. display one:  host:port/paths/jobs/xxxxxxx
jobRouter.route('/:jobID') // "/jobs/:jobID" 
  .get((req, res) => {
    const jobID = req.params.jobID;
  
    (async function searchByID() {
      try {
        const db = await mongoDButils.getConnectedMongoDB();

        const job = await db.collection('jobs').findOne(
          {
            _id: new ObjectID(jobID)
          }
        );
        res.render('job', { job } );

      } catch (error) {
        console.log(`jobRouter/search/jobID error=${JSON.stringify(error)}`)
      }
    }())
  });

  
module.exports = jobRouter;