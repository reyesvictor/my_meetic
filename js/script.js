//============ MY OWN TAILOR MADE LIBRARY =========
function sqlClean(value){
  return value.replace(/\;|\)|\-\-/g, '');
}

function myOnClick(element, functionToLaunch, valueToPass = null){
  $(element).prop("onclick", null).off("click");
  $(`${element}`).on('click', function (e) {
    functionToLaunch(e, this, valueToPass);
  })
}

function myKeypress(element, functionToLaunch, valueToPass = null){
  $(`${element}`).keypress( function (e) {
    functionToLaunch(e, this, valueToPass);
  })
}

function myChangeSelect(element, functionToLaunch, valueToPass = null){
  $(`${element}`).change( function (e) {
    console.log(`The option chosen is : ${e.target.value}`);
    functionToLaunch(e, this, valueToPass);
  })
}

function myGetValue(idOfElement){
  return $(`#${idOfElement}`).val();
}

function strToArray(data) {
  return data[0].split('|');
}

function clear() {
  $("#main-container").empty();
}

function clearResult() {
  $("#member-search-container").remove();
  $("#result").html("");
}

function clearMoviePage() {
  $("#main-movie-container").remove();
  $("div#main-container").show();
}

function fullClean() {
  clearMoviePage();
  clear();
  clearResult();
}

//A améliorer en transformant le id ou la class en variable.
function pwdChecker(pwd, divToAppendErrorMsg = null) {
  let simple = /azerty|1234|qwerty|1234|abcd/g;
  let allrequirements = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%* #=+\(\)\^?&])[A-Za-z\d$@$!%* #=+\(\)\^?&]{3,}$/;
  $('#error-input-pwd-same').remove();
  if ( pwd.match(simple) ) {
    console.log('Error, password is too simple.');
    $(`#error-input-msg-join-6`).remove(); //page join
    $(`.error-new-pwd`).remove(); //page mon compte
    $(`${divToAppendErrorMsg}`).after(`<p class='error-input-msg error-new-pwd' id='error-input-msg-join-6'>Your password is too simple.
    It can't contain qwerty, azerty, abcd or 1234.</p>`);
  } else if ( pwd.match(allrequirements) ) {
    $(`#error-input-msg-join-6`).remove(); 
    $(`.error-new-pwd`).remove(); 
    console.log('congratulations');
    return true;
  } else {
    $(`#error-input-msg-join-6`).remove(); //page join
    $(`.error-new-pwd`).remove(); //page mon compte
    $(`${divToAppendErrorMsg}`).after(`<p class='error-input-msg error-new-pwd' id='error-input-msg-join-6'>Your password requires at least one letter,
    one number and one special character.</p>`);
  }
  return false;
}

function emailStringChecker(email, div = null) {
  $(`#error-input-msg-new-email`).remove();
  $('#error-input-email-same').remove();
  var checkEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
  if ( checkEmail.test(email) ) {
    return true;
  } else if ( div ) {
    $(`${div}`).after(`<p class='error-input-msg error-new-pwd' id='error-input-msg-new-email'>Please write a correct email.</p>`);
  }
}

function ifEnterKeyTyped(e) {
  if ( e.keyCode == 13 ) {
    return true;
  }
}

function firstLetterToUppercase(word) {
  word = word.replace(/\b[a-z]/g, function(firstletters) {
    return firstletters.toUpperCase();
  })
  return word;
}

function increaseLastNumberInString(elem) {
  return elem.slice(0, -1) + (parseFloat(elem.slice(-1)) + 1);
}

function decreaseLastNumberInString(elem) {
  return elem.slice(0, -1) + (parseFloat(elem.slice(-1)) - 1);
}