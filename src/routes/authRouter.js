const express = require('express');
const debug = require('debug')('app:sessionRouter');
const { MongoClient, ObjectID } = require('mongodb');

const authRouter = express.Router();

authRouter.route('/')
  .post((req, res) => {

    res.json(req.body);
  });


  module.exports = authRouter;