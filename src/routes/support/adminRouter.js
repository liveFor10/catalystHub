const express = require('express');
const debug = require('debug')('app:adminRouter');
const mongoDB = require('../../../database/mongoDB.js');

const jobsData = require('../../../_gitIgnore/jsonData/jobs.json');

const adminRouter = express.Router();

adminRouter.route('/jobs') // "/admin/jobs" because of "app.use('/admin', adminRouter);" in app.js
.get((req, res) => {
    
    (async function mongo(){
      try {
        let db = await mongoDB.getMongoDB();

        const response = await db.collection('jobs').insertMany(jobsData);
        res.json(response);

      } catch (error) {
        debug(error.stack);
      }
    }())
});

adminRouter.route('/jobs/:jobID')
  .get((req, res) => {
    const jobID = req.params.jobID;
    res.render('job', {
      job: jobsData[jobID]
    });
});


module.exports = adminRouter;