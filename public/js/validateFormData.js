//sign up
document.getElementById("signUpSubmit").onclick = function () {
  return validateRegistration();
};

function validateRegistration() {
  var $form = $('form')[0];

  if ($form.checkValidity()) {
    console.log('valid');
    $form.submit();
    return true;
  }
  return false
}