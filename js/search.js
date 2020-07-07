//Verification de la connexion
if ( !localStorage.id ) {
  window.location.replace('../../');
} 

// ====SET UP THE PAGE====
searchPage();
getUserId();
myOnClick('li#nav-result-page', showResult);
myOnClick('li#nav-search-page', showSearch);
myOnClick('li#nav-my-account', showAccount);
myOnClick('#perform-search', getPreferencesForSearch);
myOnClick('li#nav-my-logout', logout);

function getUserId() {
  $.ajax({
    url: '../handler/search.handler.php',
    method: 'POST', 
    dataType: 'json',
    data: {verifier:'get_user_id', email:localStorage.id}, 
    success: ( 
      function(data) {
        window.user_id = data;
        console.log('User ID: ' + window.user_id);
    }), error : function (ts) {
      console.log(ts.responseText);
    } 
  })
}

function showSearch() {
  $('#main-all-container').show();
  $('#main-user-account-container').hide();
  //LAUNCH REQUESTS FOR ACCOUNT PAGE
  searchPage(user_id);
}

function showAccount() {
  $('#user-result').text('');
  $('#main-all-container').hide();
  $('#main-user-account-container').show();
  //LAUNCH REQUESTS FOR ACCOUNT PAGE
  userInformation(window.user_id);
}

//====SEARCH SELECT OPTIONS=====
function searchPage() {
  get_all_options_from_tables().then( data => {
    window.all_options = data;
    console.log(data);
    all_genders = window.all_options[0];
    all_cities = window.all_options[1];
    all_hobbies = window.all_options[2];
    display_gender(all_genders);
    display_city(all_cities);
    display_hobbies(all_hobbies);
  });
}

function get_all_options_from_tables() {
  return $.ajax({
    url: '../handler/search.handler.php',
    method: 'POST', 
    dataType: 'json',
    data: {verifier:'get_all_options', email:localStorage.id}, 
    success: ( 
      function(data) {
        return data;
    }), error : function (ts) {
      console.log(ts.responseText);
    } 
  })
}

function display_gender(all_genders) {
  console.log(all_genders);
  $('#search-genre').text('');
  all_genders.forEach( elem => {
    let name = firstLetterToUppercase(elem.name);
    let option = `<option value="${elem.id_genre}">${name}</option>`;
    $('#search-genre').append(option);
  })
}

function display_city(cities) {
  console.log(cities);
  $('#search-city-options').text('');
  cities.forEach( elem => {
    let city = firstLetterToUppercase(elem.city);
    let checkbox = `<input type="checkbox" name="${elem.city}" value="${elem.city}"/>${city}<br>`;
    $('#search-city-options').append(checkbox);
  })
}

function display_hobbies(hobbies) {
  console.log(hobbies);
  $('#search-hobbies-options').text('');
  hobbies.forEach( elem => {
    let name = firstLetterToUppercase(elem.name);
    let checkbox = `<input type="checkbox" name="${elem.name}" value="${elem.id_hobbie}"/>${name}<br>`;
    $('#search-hobbies-options').append(checkbox);
  })
}

function researchMembers(pref_hobbies, pref_age, pref_gender, pref_city) {
  return $.ajax({
    url: '../handler/researchMembers.handler.php',
    method: 'POST', 
    dataType: 'json',
    data: {
      verifier:'get_members_from_prefs', 
      hobbies:pref_hobbies,
      age:pref_age,
      gender: pref_gender,
      city: pref_city, 
      email: localStorage.id
    }, 
    success: ( 
      function(data) {
        return data;
    }), error : function (ts) {
      console.log(ts.responseText);
    } 
  })
}

function getPreferencesForSearch() {
  let pref_hobbies = "0";
  if ( $("#search-hobbies input[type='checkbox']:checked") && $("#search-hobbies input[type='checkbox']:checked").length > 0 ) {
    pref_hobbies= [];
    let i = 0;
    $("#search-hobbies input[type='checkbox']:checked").each(function(){
      pref_hobbies[i] = $(this).val();
      i++;
    })
  }
  let pref_city = 0;
  if ( $("#search-city input[type='checkbox']:checked") && $("#search-city input[type='checkbox']:checked").length > 0 ) {
    pref_city= [];
    let i = 0;
    $("input[type='checkbox']:checked").each(function(){
      pref_city[i] = $(this).val();
      i++;
    })
  }
  let pref_age = $('#search-age').val(); 
  let pref_gender = $('#search-genre').val(); 
  //Get AJAX Response
  researchMembers(pref_hobbies, pref_age, pref_gender, pref_city).then( data => {
    $('#error-no-results').text('');
    if ( !data ) {
      console.log('No users correspond to your research');
      $('#error-no-results').append('No users correspond to your research. <br>Change your preferences of research and try again.');
    } else {
      showResult(data);
    }
  })
}

function showResult(data) {
  $('#result-container').css('margin-top', '10vw');
  $('#main-result-page-container').show();
  $('#result-research-title').text('');
  $('#result-research-title').append('Here are the hottest stand users just for you');
  $('#result-research').text('');
  $('#img-arrow-right').attr("src", ""); //DELETE previous arrows
  $('#img-arrow-left').attr("src", ""); //DELETE previous arrows
  let i = 0;
  let div = '';
  let length = $.map(data, function(n, i) { return i; }).length;
  $.each( data, function (id, info) {
    id = `result-${i}`;
    idTag = `#result-${i}`;
    div = `<div id='${id}'></div>`;
    $('#result-research').append(div);
    displayUserInfo2(info[0][0], idTag);
    displayUserHobbies2(info[1], idTag);
    if ( i != 0 ) {
      $(idTag).hide(); 
    } 
    if ( i == 0 && length > 1 ) {
      $(idTag).addClass("showing");
      $('#img-arrow-right').attr("src", "../../img/stand-arrow-right.png");
      myOnClick('#img-arrow-right', nextMember);
      $('#img-arrow-left').attr("src", "../../img/stand-arrow-left.png");
      myOnClick('#img-arrow-left', prevMember);
    }
    window.lastResult = idTag;
    i++;
  })
}

function displayUserInfo2(data, divToAppend) {
  let div = '';
  $.each( data, function ( name, val ) {
    name = firstLetterToUppercase(name);
      if ( name == 'Birthdate' ) {
        let y = val.substr(0,4);
        let m = val.substr(5,2);
        let d = val.substr(8,2);
        val = `${m}/${d}/${y}`;
        val = new Date(val);
        let today = new Date();
        val = Math.floor((today-val) / (365.25 * 24 * 60 * 60 * 1000));
        div = `<div>Age : ${val}</div>`;
      } else {
        div = `<div>${name} : ${val}</div>`;
      }
      $(divToAppend).append(div);
  })
}

function displayUserHobbies2(data, divToAppend) {
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
        $(divToAppend).append(div);
      }
    })
  })
}

function nextMember() {
  let id = `#${$('.showing').attr('id')}`;
  let newId = increaseLastNumberInString(id);
  $('.showing').removeClass("showing");
  if ( $(newId) && $(newId).length == 1 ) {
    $(newId).addClass("showing");
    $(id).hide();
    $(newId).show();
  } else {
    $("#result-0").addClass("showing");
    $(id).hide();
    $("#result-0").show();
  }
}

function prevMember() {
  let id = `#${$('.showing').attr('id')}`;
  let newId = decreaseLastNumberInString(id);
  $('.showing').removeClass("showing");
  if ( $(newId) && $(newId).length == 1 ) {
    $(newId).addClass("showing");
    $(id).hide();
    $(newId).show();
  } else {
    $(window.lastResult).addClass("showing");
    $(id).hide();
    $(window.lastResult).show();
  }
}

function logout() {
  localStorage.removeItem('id');
  window.location.replace('../../');
}