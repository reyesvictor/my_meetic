// TEST REGISTERING
// let user = {
//   'firstname' : 'BillyTheMIP', 
//   'lastname': 'MLIP',
//   'birthdate': '17-12-1900', 
//   'id_genre' : 'DOUBLE SHEMALE', 
//   'city': 'BOSTON', 
//   'email': 'mip1@mip.fr',
//   'pwd' : '1234', 
//   'fav_hobbie': '1',
//   'music': '2',
//   'sport': '3'
// }
// phpRegisterUser(user);

//TEST PASSWORD
// let email = 'blip@mip.fr';
// phpEmailChecker(email);
//===============================================================================

//TODO : IF VALIDATED FOCUS THE NEXT ONE....
$("#join-0").show();
$("#join-0").focus();
let user_info = {}
let value = '';
let pwdToCheck = '';
let hobbies = getAllHobbies();
let genres = getAllGenres();

//GET ALL IDS
let form_ids = $('#join-form input[id]').map(function() {
  return this.id;
}).get();

//Event checker for all 
form_ids.forEach( elem => {
  myKeypress(`#${elem}`, verifyInput);
})

//GET ALL HOBBIES IN A LIST
function getAllHobbies() {
  $.ajax ({
    url: '../handler/gethobbies.handler.php', 
    method: 'POST',
    data : {authorize:'yes'}, 
    dataType:'json',
    success: function(listHobbies) {
      console.log(listHobbies);
      myChangeSelect('select#join-8', pushInUserObject, listHobbies);
      generateHTMLHobbiesOptions(listHobbies);
    }, error: function(ts) {
      console.log(ts.responseText);
    }
  })
}

function generateHTMLHobbiesOptions(listHobbies) {
  $.each(listHobbies, function (name, val) {
    let option = `<option name='${name}' value="${val}">${name}</option>`;
    $('#join-8').append(option);
  })
}

function getAllGenres() {
  $.ajax ({
    url: '../handler/getgenres.handler.php', 
    method: 'POST',
    data : {authorize:'yes'}, 
    dataType:'json',
    success: function(listGenres) {
      console.log(listGenres);
      generateHTMLGenresOptions(listGenres);
    }, error: function(ts) {
      console.log(ts.responseText);
    }
  })
}

function generateHTMLGenresOptions(listGenres) {
  $.each(listGenres, function (name, val) {
    let genre = `<option value='${val}'>${name}</option>`;
    $('#join-3').append(genre);
  })
}

//Event for selects
myChangeSelect('#join-2', verifyInputContent);
myChangeSelect('select#join-3', verifyInputContent);
myOnClick('button#join-9-btn-submit', pushHobbiesInUserObject);

function verifyInput(e, here) {
  if ( e.keyCode != 13 ) {
    return false;
  } else if ( e.target.value == '' ) {
    if ( $(`#error-input-msg-${here.id}`).length == 0 ) {
      $(`#${here.id}`).after(`<p id='error-input-msg-${here.id}' class='error-input-msg'>Please enter an input</p>`);
      return;
    }
    $(`#error-input-msg-${here.id}`).css('display', 'inline-flex');
  } else if ( e.target.id == 'join-0' ||  e.target.id == 'join-1' ||  e.target.id == 'join-4' ) {
    if ( parseFloat(e.target.value) || e.target.value.length == 1 ) {
      if ( $(`#error-input-msg-${here.id}`).length == 0 ) {
        $(`#${here.id}`).after(`<p id='error-input-msg-${here.id}' class='error-input-msg'>Please enter a correct name</p>`);
      }
    } else {
      $(`#error-input-msg-${here.id}`).remove();
      verifyInputContent(e, here);
    }
  } else {
    $(`#error-input-msg-${here.id}`).remove();
    verifyInputContent(e, here);
  }
}

function verifyInputContent(e, here) {
  if ( e.target.id == 'join-2') { //date-naissance
    let date = e.target.value;
    let dateArr = date.split('-');
    let year = parseFloat(dateArr[0]) + 18;
    let month = parseFloat(dateArr[1]) - 1;
    let day = parseFloat(dateArr[2]);
    let checkDate = (new Date(year, month, day) <= new Date());
    if ( checkDate == false ) {
      if ( $(`#error-input-msg-${here.id}`).length == 0 ) { //modifier cça ca beug
        $(`#${here.id}`).after(`<p class='error-input-msg' id='error-input-msg-${here.id}'>You are not 18.</p>`);
      }
      return false;
    } else {
      $(`#error-input-msg-${here.id}`).remove();
    }
  }
  if ( e.target.id == 'join-5' || e.target.name == 'email' ) { //email
    if ( emailStringChecker(e.target.value) )  {
      console.log('Email Verification In Database');
      $(`#error-input-msg-${here.id}`).remove();
      phpEmailChecker(e, here);
    } else {
      $(`#error-input-msg-${here.id}`).remove();
      $(`#${here.id}`).after(`<p class='error-input-msg' id='error-input-msg-${here.id}'>Please write a correct email</p>`);
      return false;
    }
  }
  if ( e.target.id == 'join-6') { //password confirmation
    if ( pwdChecker(e.target.value, `#${e.target.id}`) ) { 
      $(`#error-input-msg-join-5`).remove();
      pwdToCheck = e.target.value; 
      showNextInput(here);
    }
  }
  if ( e.target.id == 'join-7' && e.target.value != pwdToCheck ) { //password confirmation
    $(`#error-input-msg-${here.id}`).remove();
    $(`#${here.id}`).after(`<p class='error-input-msg' id='error-input-msg-${here.id}'>Please write the same password again.</p>`);
    return false;
  }
  //CREATION OF OBJECT
  if ( e.target.name && e.target.name != 'email' ) {
    pushInUserObject(e, here);
  }
}

function phpEmailChecker(e = null, here = null) {
  let email = e.target.value;
  $.ajax ({
    url: '../handler/emailcheck.handler.php', 
    method: 'POST',
    data : {email:email}, 
    dataType:'json',
    success: function(result) { //donne un objet
      if ( result == false) {
        console.log('✔️ This email is not registered. The user can continue.');
        window.emailtostoreinlocalstorage = email;
        pushInUserObject(e, here);
        $(`#join-5`).hide();
        $(`#join-6`).show();
        $(`#join-6`).focus();
      } else {
        console.log(`❌ This email is registered. The user is ${result.firstname} ${result.lastname}`);
        if ( $('#error-input-msg-join-5').length == 0 ) {
          $(`#join-5`).after(`<p class='error-input-msg' id='error-input-msg-join-5'>This email is registered. Please use another.</p>`);
        }
        console.log(result);
        return false;
      }
    }, error: function(ts) {
      console.log(ts.responseText);
    }
  })
}

function phpRegisterUser(user_info) {
  $.ajax ({
    url: '../handler/register.handler.php', 
    method: 'POST',
    data : {user_info}, 
    dataType:'json',
    success: function(result) { 
      console.log('PHP Result is : ');
      console.log(result);
    }, error: function(ts) {
      console.log('PHP Error : ');
      console.log(ts.responseText);
    }
  })
}

function showNextInput(here) {
  $(`#${here.id}`).hide();
  let nextInput = parseFloat(here.id.substr(-1)) + 1;
  let nextJoin = `#join-${nextInput}`;
  $(`${nextJoin}`).show();
  if ( here.id != 'join-1' ) {
    $(`${nextJoin}`).focus();
  }
  if ( here.id == 'join-1' ) {
    $('#join-subtitle').text('Enter your birthdate');
  }
  if ( here.id == 'join-2') {
    $('#join-subtitle').text('');
  }
}

function pushInUserObject(e, here, listHobbies = null) {
  value = e.target.value;
  value = sqlClean(value);
  if ( e.target.id == 'join-7') { 
    user_info[e.target.name] = value;
  } else {
    user_info[e.target.name] = value;
  }
  if ( e.target.id == 'join-8' ) {
    showNextInput(here);
    $.each(listHobbies, function (name, val) {
      if ( val != e.target.value ) {
        let checkbox = `<input type="checkbox" name="${name}" value="${val}"/>${name}<br>`;
        $('button#join-9-btn-submit').before(checkbox);
      }
    })
    $('#join-subtitle').text('Choose your other hobbies, or pass and register.');
  } else {
    showNextInput(here);
  }
}

function pushHobbiesInUserObject() {
  $("input[type='checkbox']:checked").each(function(){
    user_info[$(this).attr('name')] = $(this).val();
  })
  console.log(user_info);
  phpRegisterUser(user_info); //LAUNCH REGISTERING
  localStorage.setItem('id', window.emailtostoreinlocalstorage);
  window.location.replace('search.php'); //LAUNCH NEXT PAGE
}