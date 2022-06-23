const mongoose = require('mongoose');

const {Schema} = mongoose;

const jobModel = new Schema ({
    submittedByName: {type:String},
		submittedByEmail: {type:String},
		submittedByPhone: {type:String},
		company: {type:String},
		title: {type:String},
		city: {type:String},
		payMin: {type:String},
		payMax: {type:String},
		payUnit: {type:String},
		duties: {type:String},
		qualifications: {type:String},
		instructions: {type:String}
});


module.exports = mongoose.model('Job', jobModel);