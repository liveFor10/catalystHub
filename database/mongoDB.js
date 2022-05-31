
const { MongoClient } = require('mongodb');
const consts = require('../src/config/consts.js');


async function getMongoDB() {

  const catalystsURL = consts.mongoURL;
  const catalystsDB = 'catalystDB';
  let mongoClient;

  mongoClient = await MongoClient.connect(catalystsURL);
  const db = mongoClient.db(catalystsDB)

  return db;
}


//module.exports = getMongoDB;
exports.getMongoDB = getMongoDB;