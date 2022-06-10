
function getUserSignedUpSignedInMessage(request) {

  let retVal = 'Thank you for being a member';
  retVal = (request.user.name) ? retVal = retVal + ', ' + request.user.name + '.' : '.';
  retVal = retVal + '  You are now logged in';
  return retVal;
}


exports.getUserSignedUpSignedInMessage = getUserSignedUpSignedInMessage;