const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const {Schema} = mongoose;

const jobApplicationModel = new Schema (
	{
		applicant : { type : {
				_id : {type : ObjectId},
				name : {type : String},
				emailAddress : {type : String}
			}
		},
		job : { type : {
				_id : {type : ObjectId},
				company : {type : String},
				title : {type : String},
				city : {type : String},
				submittedOnDae : {type : String},
				submittedByID : {type : String},
				submittedByName : {type : String},
				submittedByEmail : {type : String}
			}
		},
    coverLetter : {type : String},
		pastedResume : {type : String},
		uploadedResume : { type : {
        data : Buffer,
        contentType : String,
				originalFilename: String,
				originalEncoding: String
			}
    }
	}
);


module.exports = mongoose.model('JobApplication', jobApplicationModel);