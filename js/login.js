myOnClick('#login-btn', verifyMyLoginInputs);
$('#login-0').focus();

function verifyMyLoginInputs() {
  if ( $('#login-0').val() == '' ) {
    $('#error-input-msg-login-0').remove();
    $(`#login-0`).after(`<p class='error' id='error-input-msg-login-0'>Please enter an email</p>`);
  } else { 
    $('#error-input-msg-login-0').remove();
  }
  
  if ( $('#login-1').val() == '' ) {
    $('#error-input-msg-login-1').remove();
    $(`#login-1`).after(`<p class='error-input-msg' id='error-input-msg-login-1'>Please enter a password.</p>`);
  } else { 
    $('#error-input-msg-login-1').remove();
  }
  
  if ( $('#login-0').val() != ''  && $('#login-1').val() != '') {
    verifyMyLogin();
  }
}

function verifyMyLogin() {
  let email = $('#login-0').val();
  email = sqlClean(email);
  let pwd_login = $('#login-1').val();
  pwd_login = sqlClean(pwd_login);
  $.ajax({
    url: '../handler/login.handler.php',
    method: 'POST', 
    data: {email:email, pwd_login:pwd_login},
    dataType:'json',
    success: function (result) {
      if ( result == true ) {
        console.log('✔️ The email and password is correct.');
        $(`#error-input-msg-login`).remove();
        localStorage.setItem('id', email);
        window.location.replace(' search.php');
      } else {
        console.log(`❌ This email and password is incorrect. Try again.`);
        $(`#error-input-msg-login`).remove();
        $(`#login-btn`).after(`<p class='error error-input-msg' id='error-input-msg-login'>This email and / or password is incorrect. Please try again.</p>`);
        return false;
      }
    }, error: function(ts) {
    console.log('Error: ');
    console.log(ts.responseText);
  }
})
}