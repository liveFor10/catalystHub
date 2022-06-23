const fs = require("fs");


function downloadResume(uploadedResume) {
  try {
    fs.writeFile(
      uploadedResume.originalFilename,
      uploadedResume.data,
      {
        encoding : uploadedResume.originalEncoding,
        flag : 'w'
      }
    );
  } catch (error) {
    console.log(JSON.stringify(error));
  }
}


exports.downloadResume = downloadResume;