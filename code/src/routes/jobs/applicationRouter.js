const express = require('express');
const mongoDButils = require('../../utils/mongoDButils.js');
const { ObjectID } = require('mongodb');
const userUtils = require('../../utils/userUtils.js')
const fs = require("fs");
const formidable = require("formidable");
const path = require('path');


const applicationRouter = express.Router();

/*
   -1.       authenticate
   0a. get   find by user
   0b. get   find by applicationID
   1.  post  create new
*/

// -1. challenge for credentials
applicationRouter.use((req, res, next) => {
  userUtils.credentialsChallenge(req, res, next)
});

// 0a. find by user
applicationRouter.route('/')
  .get( (req, res) => {
    applicant = {};
    applicant._id = req.user._id;
    applicant.name = req.user.name;
    applicant.emailAddress = req.user.emailAddress;

    (async function findApplicationsByUserID() {
      try {
        const db = await mongoDButils.getConnectedMongoDB();
        const iAmTheApplicant = await db.collection('applications')
          .find( { "user._id": applicant._id } )
          .toArray();

        const iAmTheEmployer = await db.collection('applications')
          .find( { "job.submittedByID": applicant._id } )
          .toArray();
        res.render(
          'applications', { applications : iAmTheApplicant, user : applicant,  submissions: iAmTheEmployer}
        );
      } catch (error) {
        console.log(`jobRouter/search/jobID error=${JSON.stringify(error)}`)
      }
    }())
  });

// 0b.
applicationRouter.route('/:applicationID') // "/applications/:applicationID" 
  .get( (req, res) => {
    const applicationID = req.params.applicationID;
  
    (async function findApplicationsByApplicationID() {
      try {
        const db = await mongoDButils.getConnectedMongoDB();
        const jobApp = await db.collection('applications')
          .findOne( { "_id" : new ObjectID(applicationID) } );
        res.render('application', { jobApp : jobApp } );
      } catch (error) {
        console.log(`jobRouter/search/jobID error=${JSON.stringify(error)}`)
      }
    }())
  });

// 1. apply button shows application 
//    submit button submits application 
applicationRouter.route('/')
  .post((req, res) => {

    (async function applyToJob() {
      let form = new formidable.IncomingForm();
      form.multiples = false;
      form.maxFileSize = 5 * 1024 * 1024; // 5MB

      var jobApp = await new Promise(function (resolve, reject) {
        
        form.parse(req, (err, fields, files) => {
          console.log(JSON.stringify(files.attachment));
          if (err) {
            reject(err);
          } else {
            let newApplication = {};
            newApplication.applicationDate =
              (new Date()).toLocaleDateString('en-US');                  //0
            newApplication.user = {};                                   //1
            newApplication.user._id = req.user._id;                    //1
            newApplication.user.emailAddress = req.user.emailAddress; //1
            newApplication.user.name = req.user.name;                //1
            newApplication.job = JSON.parse(fields.job);            //2
            newApplication.coverLetter = fields.coverLetter;       //3
            newApplication.pastedResume = fields.resume;          //4
            
            const fqDownloadFileDir =
              path.join(__dirname, "..", "..", "..", "public", "continuances", files.attachment.newFilename);
            fs.mkdirSync(fqDownloadFileDir);
            const spacelessName = files.attachment.originalFilename.replace(/\s/g, "-");
            const fqDownloadFileName = path.join(fqDownloadFileDir, encodeURIComponent(spacelessName));
            
            const fqTmpFileName = files.attachment.filepath;
            fs.renameSync(fqTmpFileName, fqDownloadFileName);

            newApplication.uploadedResume = {};
            newApplication.uploadedResume.data =
              fs.readFileSync(
                fqDownloadFileName,
                {
                  path: files.attachment._writeStream._writableState.defaultEncoding,
                  flag: 'r+'
                }
              );
            newApplication.uploadedResume.contentType = files.attachment.mimetype;
            newApplication.uploadedResume.originalFilename = spacelessName;
            newApplication.uploadedResume.originalEncoding = files.attachment._writeStream._writableState.defaultEncoding;
            resolve(newApplication);
          }
        });
      });

      try {
        const db = await mongoDButils.getConnectedMongoDB();
        //TODO:  check to see if application exists...if it doesn't
          const insertOccurred = await db.collection('applications').insertOne(jobApp);
          if (insertOccurred) {
            console.log('applicationRouter.post.apply.insertOccurred=' + JSON.stringify(insertOccurred));
            const applicationID = insertOccurred.insertedId;
            const application = await db.collection('applications').findOne(
              {
                _id: new ObjectID(applicationID)
              }
            );
            res.render('applications', { application } );
          }
        //
      } catch (error) {
        console.log(`applicationRouter/post error=${JSON.stringify(error)}`)
      }
    }()) 
  }); 
  

module.exports = applicationRouter;