const { MongoClient } = require('mongodb');
const consts = require('../../src/config/consts.js');


async function getConnectedMongoDB() {

  try {
    const catalystsURL = consts.mongoURL;
    const catalystsDB = 'catalystDB';
    let mongoClient;

    mongoClient = await MongoClient.connect(catalystsURL);
    const db = mongoClient.db(catalystsDB)

    return db;

  } catch (error) {
    console.log('mongoDButils.getConnectedMongoDB' + JSON.stringify(error));
  }
}

async function entityExistsInMongoCollection(database, collection, key) {

  try {

    const entity = await database.collection(collection).findOne({ emailAddress: key });
    return entity ? true : false;

  } catch (error) {
    console.log('mongoDButils.entityExistsInMongoCollection' + JSON.stringify(error));
  }
}
 
function createMongoFiltersFromQueryParams(reqQueryParams) {

  let andObj = {};     //all you need to AND multiple clauses
  
  // if ORs > 1
  let orArray = [];    //inner set of OR criteria
  let orObj = {};      //outer OR wrapper:  $or = '{ ' + JSON.stringify(orArray) + ' }'
  
  //no ANDs or ORs  
  let emptyObj = {};


  try {
    if (reqQueryParams.jobTitle) {
      andObj.title = `/${reqQueryParams.jobTitle.toLowerCase()}/`;
    }
    if (reqQueryParams.jobLocation) {
      andObj.city = `/${reqQueryParams.jobLocation.toLowerCase()}/`;
    }
    if (reqQueryParams.payMin) {
      andObj.payMin = `{ $gte: ${reqQueryParams.jobPayMin} }`;
    }
    if (reqQueryParams.payMax) {
      andObj.payMax = `{ $lte: ${reqQueryParams.jobPayMax} }`;
    }
    if (reqQueryParams.payMin || reqQueryParams.payMax) {
      andObj.payUnit = reqQueryParams.jobPayPer;
    }

    if (reqQueryParams.searchCriterica === "all") {  // ANDing
      return andObj;
    } else if (reqQueryParams.searchCriterica === "any") {  // ORing

      if (reqQueryParams.jobTitle) {
        orArray.push( `{title: /.*${reqQueryParams.jobTitle.toLowerCase()}.*/}` );
      }
      if (reqQueryParams.jobLocation) {
        orArray.push( `{jobLocation: /${reqQueryParams.jobLocation.toLowerCase()}/}` );
      }
      if (reqQueryParams.payMin) {
        orArray.push( `{payMin: { $gte: ${reqQueryParams.jobPayMin} }}` );
      }
      if (reqQueryParams.payMax) {
        orArray.push( `{payMax: { $lte: ${reqQueryParams.jobPayMax} }}` );
      }
      if (reqQueryParams.payMin || reqQueryParams.payMax) {
        orArray.push( `{payUnit: {${reqQueryParams.jobPayPer}}` );
      }
      if (orArray.length > 1) {
        orObj.$or = '{ ' + JSON.stringify(orArray) + ' }';
        return orObj;
      } else if (orArray.length == 1) {
        return andObj;
      }
    }

    return emptyObj;

  } catch (error) {
    console.log('mongoDButils.createMongoFiltersFromQueryParams error=' + JSON.stringify(error));
  }
}


exports.getConnectedMongoDB = getConnectedMongoDB;
exports.entityExistsInMongoCollection = entityExistsInMongoCollection;
exports.createMongoFiltersFromQueryParams = createMongoFiltersFromQueryParams;