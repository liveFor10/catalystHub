//reset controls in signup form
document.getElementById("cfd").onclick = function () {
  document.getElementById("nme").value = '';
  document.getElementById("usr").value = '';
  document.getElementById("pwd").value = '';

  document.getElementById('nme').focus();
};

//search jobs
document.getElementById("ss").onclick = function () {
  console.log('validateFormData.document.getElementById("ss").onclick');
};

document.getElementById("submitSearch").onclick = function () {
  console.log('validateFormData.document.getElementById("submitSearch").onclick');
};

document.getElementById("searchSubmit").onclick = function () {
  console.log('validateFormData.document.getElementById("searchSubmit").onclick');
};

function validateSearch() {
  //
  console.log('validateFormData.validateSearch');
}

function validateRegistration() {
  var $form = $('form')[0];

  if ($form.checkValidity()) {

    return true;
  }
  return false
}