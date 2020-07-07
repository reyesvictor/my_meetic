myOnClick('button#delete-account', deleteAccount);

function userInformation(user_id) {
  $.ajax ({ 
    url: '../handler/account.handler.php',
    method: 'POST',
    data: {user_id:user_id}, 
    dataType: 'json', 
    success:(
      function (data) {
        window.user_info = data[0];
        console.log(data);
        $('#user-result').text(''); //delete content
        displayUserInfo(data[0]);
        displayUserHobbies(data[1]);
    }), error : function (ts) {
      console.log(ts.responseText);
    }
  })
}

function displayUserInfo(data) {
  let div = '';
  $.each( data, function ( name, val ) {
    name = firstLetterToUppercase(name);
    if ( name == 'Password' ) {
      window.pwd = val;
      div = `<div id='user-pwd'></div>`;
      $('#user-result').append(div);
      div = `<button id='btn-change-pwd' class='btn'>Change My Password</button>`;
      $('#user-pwd').append(div);
      myOnClick('button#btn-change-pwd', changePwd);
    } else if ( name == 'Email' ) {
      div = `<div id='user-email'>${name} : ${val}</div>`;
      $('#user-result').append(div);
      div = `<button id='btn-change-email' class='btn'>Change My Email</button>`;
      $('#user-email').append(div);
      myOnClick('button#btn-change-email', changeEmail);
    } else {
      if ( name == 'Birthdate' ) {
        let y = val.substr(0,4);
        let m = val.substr(5,2);
        let d = val.substr(8,2);
        val = `${d}/${m}/${y}`;
      }
      if ( name != 'Password Crypted' ) {
        val = firstLetterToUppercase(val);
      }
      div = `<div>${name} : ${val}</div>`;
      $('#user-result').append(div);
    }
  })
}

function displayUserHobbies(data) {
  let div = '';
  let i = 1;
  $.each( data, function ( name, value ) {
    $.each( value, function ( name, val ) {
      if ( name == 'name' ) {
        if ( value['fav_hobbie'] == '1') {
          name = 'Favourite Hobbie';
        } else {
          name = `Hobbie ${i}`;
          i++;
        }
        div = `<div>${name} : ${val}</div>`;
        $('#user-result').append(div);
      }
    })
  })
}

function deleteAccount() { //#delete-account
  if (confirm('Are you sure you want to delete your account ? This action is irreversible.')) {
    $.ajax ({ 
      url: '../handler/deleteaccount.handler.php',
      method: 'POST',
      data: {user_id:window.user_id}, 
      dataType: 'json', 
      success:(
        function (data) {
          localStorage.removeItem('id');
          delete(window.user_id);
          delete(window.user_info);
          window.location.replace('../../'); //LAUNCH NEXT PAGE
          console.log(data);
      }), error : function (ts) {
        console.log(ts.responseText);
      }
    })
  } 
}

function changePwd(e, here) {
  // 04/02/1998
  if ( $('#my-new-password').length == 0) {
    input = `<input type='password' placeholder='Enter your actual password' id='my-old-password' class='input-change-my-info'/>`;
    console.log(e);
    $(`#${e.target.id}`).after(input);
    $(`#my-old-password`).focus();
    myKeypress(`#my-old-password`, verifyOldPassword, e.target.id);
  }
}

function changeEmail(e, here) {
  $('#error-email-taken').remove();
  if ( $('#my-new-email').length == 0) {
    input = `<input type='text' placeholder='My New Email' id='my-new-email' class='input-change-my-info'/>`;
    console.log(e);
    $(`#${e.target.id}`).after(input);
    $(`#my-new-email`).focus();
    myKeypress(`#my-new-email`, verifyMyNewEmail, e.target.id);
  }
} //reprendre ici creation du nouveau input email

function verifyOldPassword(e, here, divToAppend) {
  let pwd = e.target.value;
  let div = `#` + e.target.id;
  if ( ifEnterKeyTyped(e)  ) {
    $('.error-old-email').remove();
    if ( window.pwd != pwd ) {
      if ( $('.error-old-email').length == 0 ) {
        $(`${div}`).after(`<p class='error-input-msg error-old-email' id='error-input-pwd-same'>It is not your actual password. Try Again.</p>`);
      }
      return false;
    } else {
      $('#my-old-password').remove();
      input = `<input type='password' placeholder='Enter your new password' id='my-new-password' class='input-change-my-info'/>`;
      $(`#btn-change-pwd`).after(input);
      $(`#my-new-password`).focus();
      myKeypress(`#my-new-password`, verifyMyNewPassword, e.target.id);
    }
  }
}

function verifyMyNewPassword(e, here, divToAppend) {
  let pwd = e.target.value;
  let div = `#` + e.target.id;
  if ( ifEnterKeyTyped(e) && pwdChecker(pwd, div) ) {
    if ( pwd == window.user_info['Password'] ) {
      $(`${div}`).after(`<p class='error-input-msg error-new-email' id='error-input-pwd-same'>Your password can't be the same</p>`);
      return false;
    }
    console.log('New PassWord is Correct');
    let pwdToCompare = pwd;
    let input = `<input type='password' placeholder='Retype the password.' id='my-new-password-verify' class='input-change-my-info'/>`;
    $(`#my-new-password`).after(input);
    $(`#my-new-password-verify`).focus();
    $('#my-new-password').remove();
    myKeypress(`#my-new-password-verify`, retypeMyNewPassword, pwdToCompare);
    localStorage.setItem('id', pwd);
  }
}

function verifyMyNewEmail(e, here, divToAppend) {
  let email = e.target.value;
  let div = `#` + e.target.id;
  if ( ifEnterKeyTyped(e) && emailStringChecker(email, div) ) {
    if ( email == window.user_info['email'] ) {
      $(`${div}`).after(`<p class='error-input-msg error-new-email' id='error-input-email-same' class='input-change-my-info'>Your email can't be the same</p>`);
      return false;
    }
    console.log('New Email is Correct');
    let emailToCompare = email;
    let input = `<input type='text' placeholder='Retype the email.' id='my-new-email-verify'/>`;
    $(`#my-new-email`).after(input);
    $(`#my-new-email-verify`).focus();
    $('#my-new-email').remove();
    myKeypress(`#my-new-email-verify`, retypeMyNewEmail, emailToCompare);
  }
}

function retypeMyNewPassword(e, here, pwdToCompare) {
  let value = e.target.value;
  let id = e.target.id;
  if ( ifEnterKeyTyped(e) ) {
    if ( value == pwdToCompare ) {
      console.log('Same password.');
      $('#error-input-msg-verify').remove();
      changePwdConfirmation(value);
    } else {
      if ( $('#error-input-msg-verify').length == 0 ) {
        $('#error-input-msg-verify').remove();
        $(`#${id}`).after(`<p class='error-input-msg error-new-email' id='error-input-msg-verify'>Your new password doesn't match</p>`);
      }
    }
  }
}

function retypeMyNewEmail(e, here, emailToCompare) {
  let value = e.target.value;
  let id = e.target.id;
  if ( ifEnterKeyTyped(e) ) {
    if ( value == emailToCompare ) {
      console.log('Same password.');
      $('#error-input-msg-verify').remove();
      changeEmailConfirmation(value);
    } else {
      if ( $('#error-input-msg-verify').length == 0 ) {
        $('#error-input-msg-verify').remove();
        $(`#${id}`).after(`<p class='error-input-msg error-new-email' id='error-input-msg-verify'>Your new email doesn't match</p>`);
      }
    }
  }
}

function changePwdConfirmation(pwd) {
  let user_info = {
    'pwd' : pwd,
    'user_id' : window.user_id
  }
  if (confirm('Are you sure you want to change your password ?')) {
    $.ajax ({ 
      url: '../handler/changeUserInfo.handler.php',
      method: 'POST',
      data: {user_info:user_info}, 
      dataType: 'json', 
      success:(
        function (data) {
          console.log(data);
          $('#user-result').text(''); //delete content
          userInformation(window.user_id); //reload infos
      }), error : function (ts) {
        console.log(ts.responseText);
      }
    })
  } else {
    //supprimer le champ d'ecriture ou autre... remettre les parametres a 0
  }
}

function changeEmailConfirmation(email) {
  let user_info = {
    'email' : email,
    'user_id' : window.user_id
  }
  if (confirm('Are you sure you want to change your email ?')) { //etape 1 , verifier si le email est deja pris, et ensuite le modifier
    $.ajax ({ 
      url: '../handler/changeUserInfo.handler.php',
      method: 'POST',
      data: {user_info:user_info}, 
      dataType: 'json', 
      success:( 
        function (data) {
          console.log(data);
          if ( data == 'Email already taken.' ) {
            $('#my-new-email-verify').remove();
            $(`#btn-change-email`).after(`<p class='error-input-msg error-new-email' id='error-email-taken'>${data}</p>`);
          } else { 
            userInformation(window.user_id); //reload infos
          }
      }), error : function (ts) {
        console.log(ts.responseText);
      }
    })
  } else {
    //supprimer le champ d'ecriture ou autre... remettre les parametres a 0
  }
}