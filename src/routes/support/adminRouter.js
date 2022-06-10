const express = require('express');
const debug = require('debug')('app:adminRouter');
const mongoDButils = require('../../utils/mongoDButils.js');

const jobsData = require('../../../_gitIgnore/jsonData/jobs.json');

const adminRouter = express.Router();

adminRouter.route('/jobs') // "/admin/jobs" because of "app.use('/admin', adminRouter);" in app.js
.get((req, res) => {
    
    (async function manualAdminMaintenance(){
      try {
        let db = await mongoDButils.getConnectedMongoDB();

        const response = await db.collection('jobs').insertMany(jobsData);
        res.json(response);

      } catch (error) {
        console.log(`adminRouter.manualAdminMaintenance error=${error}`)
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