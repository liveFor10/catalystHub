
function getUserSignedUpSignedInMessage(request) {

  let retVal = 'Thank you for being a member';
  retVal = (request.user.name) ? retVal = retVal + ', ' + request.user.name + '.' : '.';
  retVal = retVal + '  You are now logged in';
  return retVal;
}

function credentialsChallenge(req, res, next) {
  if (req.user) {  //already logged in
    next();
  } else {
    res.redirect('/auth/signIn'); //not logged in
  }
}

exports.credentialsChallenge = credentialsChallenge;
exports.getUserSignedUpSignedInMessage = getUserSignedUpSignedInMessage;