//=============HOMEPAGE=============
displayWelcomePage();

function displayWelcomePage() {
  $gif_to_display = Math.floor(Math.random() * 11) + 1;
  $("#main-container").append("<div id='homepage-container'></div>");
  $("#homepage-container").append("<h1 id='title-homepage'>Welcome to my_cinema !</h1>");
  $("#homepage-container").append(`<p>Here you will find the best movies to watch.</p>`);
  $("#homepage-container").append(`<img src='img/welcome/${$gif_to_display}.gif' alt='Bad Input Gif' id='welcome-gif' class='lost'>`);
  $('#logo').click(function () {
    location.reload(true);
  })
  $('#home').click(function () {
    location.reload(true);
  })
}

//============ MY OWN TAILOR MADE LIBRARY =========
function myOnClick(element, functionToLaunch, valuetopass = null){
  $(`${element}`).on('click', function () {
    functionToLaunch(valuetopass);
  })
}

function myKeypress(element, functionToLaunch){
  $(`${element}`).keypress( function (e) {
    functionToLaunch(e, this);
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

//===========MENU CONNECTION CLIENT============
verifyLocalStorage();

function verifyLocalStorage(checkForMovieIcon = null) {
  if ( localStorage.length > 0 && localStorage.User && localStorage.User != '' ) {
    if ( checkForMovieIcon == 'check' ) {
      return true;
    }
    console.log('User Detected');
    $(`#subscription-li-menu`).after(`<li><a value='disconnect' id='disconnect-li-menu'>DISCONNECT</a></li>`);
    myOnClick('#disconnect-li-menu', deleteLocalStorage);
    myUserMenu();
  } else {
    if ( checkForMovieIcon == 'check' ) {
      return false;
    }
    console.log('No User Detected');
    $(`#subscription-li-menu`).after(`<li><a value='connect' id='connect-li-menu'>CONNECT</a></li>`);
    $(`#connect-li-menu`).after(`<input type="text" id="connect-input-id-perso" name="Input-Connect" placeholder="My Personnal Id" style='display:none;'>`);
    myOnClick('#connect-li-menu', displayConnectInput);
    myKeypress('#connect-input-id-perso', processConnectionInput);
  }
}

function deleteLocalStorage(){
  localStorage.removeItem('User');
  location.reload(true);
}

function displayConnectInput() {
  $('#connect-input-id-perso').animate({width:'toggle'},350);
}

function processConnectionInput(e, thisWasClicked) { //element clicked needs an ID to work
  if ( e.keyCode ==  13 ) {
    let id_perso = myGetValue(thisWasClicked.id);
    if ( !id_perso ) {
      errorUserInput('Please enter an id.');
    }
    else if ( !parseFloat(id_perso) ) {
      errorUserInput('Please enter a number.');
    }
    requestPHP('perso-connection', id_perso);
  }
}

function processDataOfUser(user_data) {
  if ( user_data.length > 0 ) {
    user_data = user_data[0].split('|');
    $('#connect-li-menu').remove();
    $('#connect-input-id-perso').remove();
    $('#error-msg').remove();
    localStorage.setItem( 'User', user_data[0]);
    localStorage.setItem('UserData', user_data);
    verifyLocalStorage();
  }
  else {
    errorUserInput('This id is not registered.');
    console.log(`This id is not registered`);
  }
}

function errorUserInput(msg) {
  $('#error-msg').remove();
  $('#connect-input-id-perso').after(`<p id='error-msg' style='display: none;'>${msg}</p>`);
  $('#error-msg').animate({
    height:'toggle'
  },20);
}

//=============USER ACCOUNT INFO================
function myUserMenu() {
  $('header').after(`<div id='user-menu-container'></div>`);
  $('#user-menu-container').append(`<nav class='navbar, container-style' id='user-menu'></nav>`);
  $('#user-menu').append(`<li id='user-li-account'><a>MY ACCOUNT</a></li>`);
  $('#user-menu').append(`<li id='user-li-historic'><a>MY HISTORIC</a></li>`);
  $('#user-menu').append(`<li id='user-li-reviews'><a>MY REVIEWS</a></li>`);
  $('#user-menu').append(`<li id='user-li-subscription'><a>MY SUBSCRIPTION</a></li>`);
  myOnClick('#user-li-account a', userInfoAccount);
  myOnClick('#user-li-historic a', userHistoricAccount);
  myOnClick('#user-li-reviews a', userReviewsAccount);
  myOnClick('#user-li-subscription a', userSubscriptionAccount);
}

function userInfoAccount() {
  clear();
  $(`#date-picker-container`).remove();
  clearMoviePage();
  clearResult();
  $("#main-container").append("<div id='homepage-container'></div>");
  $("#homepage-container").append("<h1 id='title-homepage'>Page Account</h1>");
  $("#homepage-container").append(`<p>Here you will find all your information.</p>`);
  let user_data_arr = localStorage.UserData.split(',');
  let id_perso = user_data_arr[0];
  let nom = user_data_arr[1];
  let prenom = user_data_arr[2];
  let date_naissance = user_data_arr[3];
  let email = user_data_arr[4];
  let adresse = user_data_arr[5];
  let cpostal = user_data_arr[6];
  let ville = user_data_arr[7];
  let pays = user_data_arr[8];
  
  let nameOfValue = ['Id perso: ', 'Nom: ', 'Prenom: ', 'Date de naissance: ', 'Email: ', 'Adresse: ', 'Code Postal: ', 'Ville: ', 'Pays: '];  

  for (let i = 0; i < user_data_arr.length; i++) {
    if ( user_data_arr[i] ) {
      if ( i == 3 &&  user_data_arr[i] ) {
        $('#main-container').append(`<p>${nameOfValue[i]}${date_naissance.substr(0,10)}</p>`);
      } else {
        $('#main-container').append(`<p>${nameOfValue[i]}${user_data_arr[i]}</p>`);
      }
    }
  }
} 

function userHistoricAccount() {
  $(`#date-picker-container`).remove();
  clear();
  clearMoviePage();
  clearResult();
  let user_data_arr = localStorage.UserData.split(',');
  let id_perso = user_data_arr[0];
  requestPHP('member-historic', id_perso);
} 

function userReviewsAccount() {
  $(`#date-picker-container`).remove();
  clear();
  clearMoviePage();
  clearResult();
  let user_data_arr = localStorage.UserData.split(',');
  let id_perso = user_data_arr[0];
  requestPHP('user-reviews', id_perso); 
} 

function displayReviewsAccount(reviews_data) {
  let id_film = '';
  let review = '';
    id_film = reviews_data.split('|')[3];
    review = reviews_data.split('|')[9];
    $(`#${id_film}`).append(`<div id='${id_film}-review'></div>`);
    $(`#${id_film}-review`).append(`<h2 id='review-title'>Your review was the following: </h2>`);
    $(`#${id_film}-review`).append(`<h2 id='review-content'>${review}</h2>`);
    $(`#${id_film}`).after(`</br>`);
    $(`#${id_film}`).css('width', '100%');
    if ( review.length > 100 ) {
      $('#review-content').css('font-size', 'smaller');
    }
    $(`#${id_film}-review`).css('width', '100%');

}

function userSubscriptionAccount() {
  $(`#date-picker-container`).remove();
  clear();
  clearMoviePage();
  clearResult();
  let user_data_arr = localStorage.UserData.split(',');
  let id_perso = user_data_arr[0];
  sql_inj = `(SELECT m.id_membre FROM membre m LEFT JOIN fiche_personne fp ON fp.id_perso=m.id_fiche_perso WHERE fp.id_perso = ${id_perso})`;
  requestPHP('search-membersubscriptionbyid', sql_inj);
} 


//HISTORIC OF ALL
function getMemberHistoric(inf) {
  let id_perso = inf[2];
  let id_membre = inf[3];
  let nameUser = data[0].split("|");
  let str = "";
  $historic_btn = `<button id='${id_perso}' class='btn-member-search'>See Historic</button>`;
  $subscription_btn = `<button id='${id_perso}-sub' value='${id_membre}'  class='btn-member-search'>Manage Subscription</button">`;
  str = "<p>" + inf[0] + " " + inf[1] + $historic_btn + $subscription_btn + "</p>";

  $("#result").append(str);
  //PAGE MEMBER -> LANCER HISTORIQUE DE LABONNEMENT VIA BOUTON
  $(`#${id_perso}`).on("click", function() {
    clear();
    $("#main-container").append(`<h1 id='title-his'>Historic of ${nameUser[0]} ${nameUser[1]}</h1>`);
    $("#title-his").after(requestPHP("member-historic", id_perso)); 
  });
  //PAGE MEMBER -> LANCER AFFICHAGE DE LABONNEMENT VIA BOUTON
  $(`#${id_perso}-sub`).on("click", function() {
    clear();
    $("#title-his").after(requestPHP("search-membersubscriptionbyid", id_membre)); 
  });
}

//PAGE MY SUBCRIPTION
$("#member-sub").on("click", function() {
  clearMoviePage();
  clear();
  clearResult();
  $("#main-container").before("<div id='member-search-container' class='container-style'></div>");
  $("#member-search-container").append("<h1 id='title-mem'>Manage Subscription</h1>");
  $("#member-search-container").append("<input id='search-membersubscriptionbyid' placeholder='Enter Member Id'/>");
  $("#main-container").append("<div id='result'></div>");
  $("#search-membersubscriptionbyid").keypress(function(e) {
    verifyBeforePHPRequest(e, "search-membersubscriptionbyid", e.target.value);
  });
});

//======ADMIN GET ALL MEMBERS
function displayAccount(data) {
  let id_abo = data[3];
  let id_member = data[0];
  let str = "";
  let id = "";
  let abo_list = ["2", "1", "3", "4"];
  let abo_obj = {
    1: '<input type="radio" name="sub" value="1" class="subscription"> VIP. Price: 60$. A whole month: 30 days.<br>',
    2: '<input type="radio" name="sub" value="2" class="subscription" id="gold"> GOLD. Price:  500 $. Whole year: 365 days.<br>',
    3: '<input type="radio" name="sub" value="3" class="subscription"> Classic. Price: 40$. Monthly subscription, illimited movies.<br>',
    4: '<input type="radio" name="sub" value="4" class="subscription"> Pass Day. Price: 15$. For 1 / one day.<br>'
  };
  $("#main-container").append("<div id='member-sub-container'></div>");
  $("#member-sub-container").append("<div id='member-sub-status'></div>");
  $("#member-sub-status").after("<div id='member-sub-options'></div>");

  //Status
  if (id_abo == 0) {
    str = "This member do not have a subscription plan.";
    $("#member-sub-options").append(
      "<button value='add' class='subscription-choice btn-subs' id='btn-sub-add'>Add a subscription</button>"
    );
  } else {
    str = `This member has a ${data[4]} subscription plan. The price is ${data[6]} $ and is ${data[7]} days long.`;
    $("#member-sub-options").append("<button value='mod' class='subscription-choice btn-subs'  id='btn-sub-mod'>Modify my subscription</button>");
    $("#member-sub-options").append("</br><button value='0' class='subscription btn-subs' id='btn-sub-del'>Delete my subscription</button>");
  }
  $("#member-sub-status").text(str);

  //ADD
  $(".subscription-choice").click(function(e) {
    $(this).after("<form id='subform'></form>");
    abo_list.forEach(elem => {
      id_abo == parseInt(elem) ? false : $("#subform").append(abo_obj[elem]);
    });
    //MODIFY
    $("input[name=sub]").change(function(e) {
      refreshSubscription(id_member, e.target.value);
    });
  });
  //DELETE id_abo => 0
  $(".subscription").on("click", function(e) {
    refreshSubscription(id_member, e.target.value);
  });
}

function refreshSubscription(id_member, id_abo_to_get) {
  id = id_member + "|" + id_abo_to_get;
  requestPHP("subscription-modif", id);
  $("#member-sub-container").remove();
  $("#title-his").after(requestPHP("search-membersubscriptionbyid", id_member));
}


//===========PHP REQUEST DATA============
$("#search").keypress(function(e) {
  verifyBeforePHPRequest(e, "search");
});

//GET MEMBERS
$("#member").on("click", function() {
  clear();
  clearMoviePage();
  $("#member-search-container").remove();
  $("#main-container").before("<div id='member-search-container' class='container-style'></div>"  );
  $("#member-search-container").append("<h1>Search For A Member</h1>");
  $("#member-search-container").append("<input id='search-member' placeholder='Sarah Connor ?'/>");

  //PHP REQUEST MEMBER NAME -> JSON with MEMBER info
  $("#search-member").keypress(function(e) {
    verifyBeforePHPRequest(e, "search-member");
  });
});

//GET LATEST MOVIES
$("#uppernews-container").on("click", function() {
  $("#member-search-container").remove();
  requestPHP("newmovies");
});

//TEXT FOR NEWMOVIES
$("#uppernews-container").html("<h2 id='up-title'>New Movies In Theaters Tonight</h2>");

//CHECK INPUT BEFORE LAUNCHING
function verifyBeforePHPRequest(e, research, id) {
  if (e.keyCode == 13 && e.target.value != "") {
    let str = "";

    if ($("#search").length > 0 && e.originalEvent.path[0].id == "search") {
      requestPHP(research, id);
      return false;
    }
    if (
      $("#search-member").length > 0 &&
      e.originalEvent.path[0].id == "search-member" &&
      isNaN(parseInt($("#search-member").val()))
    ) {
      requestPHP(research, id);
    } else if ( $("#search-membersubscriptionbyid").length > 0 
    && e.originalEvent.path[0].id == "search-membersubscriptionbyid" 
    && !isNaN(parseInt($("#search-membersubscriptionbyid").val())) == true ) {
      requestPHP(research, id);
    } else {
      clearMoviePage();
      clear();
      e.originalEvent.path[0].id != "search-member" ? (str = "numbers") : (str = "letters");
      $("#main-container").append(`<p>Error. Please write only ${str}. You are almost there!</p>`);
      $("#main-container").append("<img src='img/badinput_almost.gif' alt='Bad Input Gif' class='lost'>");
    }
  }
}

function datePicker() {
  $('#date-picker-container').remove();
  $("#main-container").before(`<div id='date-picker-container' class='container-style'></div>`);
  $("#date-picker-container").append("<div id='title-datepicker-container'></div>");
  $("#title-datepicker-container").append("<h1 id='title-mov'>What movies are on-screen tonight ? !</h1>");
  $("#date-picker-container").append(`<input type="text" id="date-picker" placeholder='Choose your date' autofill="off" autocomplete="off">`);
  // $('input[autofill="off"]').disableAutofill();
  $(`#date-picker`).datepicker({
    minDate: new Date('01-01-1942'), //BONUS: automate this if possible..
    maxDate: new Date('01-18-2008'),
    changeYear: true,
    changeMonth: true,
    onSelect: function() { 
        var dateObject = $(this).datepicker('getDate');
        let chosenProjectionDate = $.datepicker.formatDate("yy-mm-dd", dateObject); //format date du sql: yy-mm-dd
        requestPHP('movies-by-proj-date', chosenProjectionDate);
      }
  });
}

function requestPHP(sql_opt, id = null) {
  switch (sql_opt) {
    case "search":
      var search = $("#search").val();
      var filtre = $("#filter").val();
      break;
    case "search-member":
      var search = $("#search-member").val();
      var filtre = "search-m-filter-id-null";
      break;
    case "new-movies":
      var search = "newmovies";
      break;
  }
  if ( sql_opt == 'add-movie-historic' 
    || sql_opt == 'remove-movie-historic'
    || sql_opt == 'movies-by-proj-date' 
    || sql_opt == 'publish-review'
    || sql_opt == 'verify-if-movie-in-historic'
    || sql_opt == "perso-connection"
    || sql_opt == "movie-info"
    || sql_opt == "subscription-modif"
    || sql_opt == "search-membersubscriptionbyid"
    || sql_opt ==  "member-historic"
    || sql_opt == 'user-reviews' ) {
    var search = id;
  }
  $.ajax({
    url: "php/fetch.php",
    method: "POST",
    data: { sql_opt: sql_opt, search: search, filter: filtre },
    dataType: "json",
    success: function(data) {
      switch ( sql_opt ) {
        case "search":
          clearMoviePage();
          clear();
          clearResult();
          $('#date-picker-container').remove();
          if ( data == false) {
            $("#main-container").append("<div id='title-container'></div>");
            $("#title-container").append("<h1 id='title-mov'>Movies Results</h1>");
            $("#main-container").append("<p>There are no results.</p>");
            $("#main-container").append(
              "<img src='img/lost.webp' alt='ID Member doesn't exists' class='lost'>");
            return;
          }
          window.data = data; 
          $("#main-container").append("<div id='title-container'></div>");
          $("#title-container").append("<h1 id='title-mov'>Movies Results</h1>");
          data.length == 0
            ? $("#main-container").append("<p>There are no results.</p>")
            : display(data);
          data.length == 0
            ? $("#main-container").append(
                "<img src='img/lost.webp' alt='ID Member doesn't exists' class='lost'>")
            : false;
          break;
        case "search-member":
          window.data = data;
          clearMoviePage();
          $('#date-picker-container').remove();
          clear();
          $("#main-container").append("<div id='title-container'></div>");
          $("#title-container").append(
            "<h1 id='title-mem'>Members Results</h1>"
          );
          data.length == 0
            ? $("#main-container").append(
                "<p>There are no names corresponding.</p>"
              )
            : display(data);
          data.length == 0
            ? $("#main-container").append(
                "<img src='img/lost.webp' alt='ID Member doesn't exists' class='lost'>"
              )
            : false;
          break;
        case "member-historic":
          window.data = data;
          $('#date-picker-container').remove();
          $("#main-container").append("<div id='title-container'></div>");
          $("#title-container").append("<h1>My Historic</h1>");
          data.length == 0
            ? $("#main-container").append("<p>There are no results.</p>")
            : display(data);
          data.length == 0
            ? $("#main-container").append(
                "<img src='img/lost.webp' alt='ID Member doesn't exists' class='lost'>"
              )
            : false;
          break;
        case "newmovies":
          window.data = data;
          fullClean();
          datePicker();
          break;
        case "search-membersubscriptionbyid":
          clearMoviePage();
          $('#date-picker-container').remove();
          clear();
          $("#main-container").append("<div id='title-container' class='subscription-main-div'></div>");
          if (data.length == 0) {
            $("#title-container").append(
              `<h1 id=\'title-mov\'>Account of ... nobody :(</h1>`
            );
            $("#main-container").append(
              "<p>This account doesn't exists. Please type a correct member id.</p>"
            );
            $("#main-container").append(
              "<img src='img/lost.webp' alt='ID Member doesn't exists' class='lost'>"
            );
          } else {
            $("#title-container").after(
              `<img id='loading' src='img/loading.gif' style='margin-left: 30%; title='Loading please wait.'>`
            );
          setTimeout(function() {
              data = data[0].split("|");
              $("#title-mov").remove();
              $("#loading").remove();
              $("#title-container").append(
                `<h1 id='title-mov'>Account of ${data[1]} ${data[2]}</h1>`
              );
              displayAccount(data);
          }, 2000);
        }
          break;
        case "movie-info":
          moviePage(data);
          break;
        case "perso-connection":
          processDataOfUser(data);
          break;
        case 'verify-if-movie-in-historic':
          myHistoricIconMaker(data, id);
          break;
        case 'add-movie-historic':
          let id_user = id.split('|')[0];
          let id_film = id.split('|')[1];
          myHistoricIconChecker(id_film);
          break;
        case 'remove-movie-historic':
          myHistoricIconChecker(id);
          break;
        case 'movies-by-proj-date':
          fullClean();
          $("#main-container").append("<div id='title-container'></div>");
          $("#title-container").append("<h1 id='title-mov'>Movies Results</h1>");
          data.length == 0
            ? $("#main-container").append("<p>There are no results.</p>")
            : display(data, 'by-date');
          data.length == 0
            ? $("#main-container").append(
                "<img src='img/lost.webp' alt='This date has no movies.' class='lost'>")
            : false;
          break;
          case 'user-reviews':
            $("#main-container").append("<div id='title-container'></div>");
            $("#title-container").append("<h1 id='title-my-reviews'>My Reviews</h1>");
            data.length == 0
            ? $("#main-container").append("<p>There are no results.</p>"): display(data);
            data.length == 0
            ? $("#main-container").append("<img src='img/lost.webp' alt='This date has no movies.' class='lost'>")
            : false;
          break;
          
      }
    },
    error: function(ts) {
      console.log(ts.responseText);
   }
  });
}

//==================DISPLAY MY DATA======================
var nbr_of_result_to_display = 8;

//PAGE CONSTRUCTOR + RESULTS DISPLAY
function display(data) {
  $("#main-container").append("<div id='result'></div>");
  $("#result").append(`<div id='result-nbr'>${data.length} results</div>`);

  if ( data.length > nbr_of_result_to_display ) {
    myPages(data);
  } else {
    allResultsWithNoButton(data);
  }
}

//SHOW ALL RESULTS
function allResultsWithNoButton(data) {
  let i = 0;

  if ( $('#search-member') && $('#search-member').length > 0  ) {
    $("#main-container").append("<div id='result'></div>");
    $("#result").append(`<div id='result-nbr'>${data.length} results</div>`);
    myPages(data, nbr_of_result_to_display, 'member');
  } else {
    data.forEach(elem => {
      myMovieCardWithAPI(elem, i);
      i++;
    });
  }
}

//GENERATE SELECTOR OPTIONS (SHOW ITEMS PER PAGE)
function mySelectorOptions(nbr_rslt, nbr_of_result_to_display) {
  $("#title-container").append("<select id='select-r'></select>");
  //DECIDE HOW MANY ITEMS PER PAGE BY DEFINING THE SELECTOR OPTIONS. IMPORTANT.
  for (let i = nbr_of_result_to_display; i <= nbr_rslt; i = i * 2) {
    $("#select-r").append(`<option value='${i}'>${i} results per page</option>)`);
  }
  $("#select-r").append(`<option value='${nbr_rslt}'>Show All Results</option>)`);
  //IF NEW NUMBER SELECTED RELAUNCH DISPLAY / PAGES GENERATOR
  $("#select-r").change(function(option) {
    myPages(window.data, option.target.value); 
  });
}

//PAGINATION, GENERATE BUTTONS, PAR DEFAUT 5 RESULTATS SAFFICHENT
function myPages(data, nbr_rslt = nbr_of_result_to_display, opt = null) { //ne pas changer nbr_rslt
  var pages = Math.ceil(data.length / nbr_rslt); 
  $("#pages-container").remove();
  $("#main-container").append("<div id='pages-container'></div>");
  if (nbr_rslt == data.length) {
    clearMoviePage();
    clearResult();
    allResultsWithNoButton(data);
    return;
  }
  //PAGE NUMBER BUTTON MAKER
  for (let i = 1; i <= pages; i++) {
    $("#pages-container").append("<button id='page-" + i + "'>" + i + "</button>");
    //AFFICHAGE DE PAGES
    $("#page-" + i).on("click", function() {
      $("#result").html("");
      if (i == 1) {
        for (let j = 0; j <= nbr_rslt - 1; j++) {
          if ( opt == 'member') {
            if ( data[j] && data[j] != undefined ) {
              getMemberHistoric(data[j].split("|"));
            }
          } else {
            $("#title-mem").text() == ""
              ? myMovieCardWithAPI(data[j])
              : getMemberHistoric(data[j].split("|"));
          }
        }
      } else {
        for ( let j = (i - 1) * nbr_rslt; j <= (i - 1) * nbr_rslt + (nbr_rslt - 1); j++) {
          if (data[j] == null) {
            break;
          } else {
            $("#title-mem").text() == ""
              ? myMovieCardWithAPI(data[j])
              : getMemberHistoric(data[j].split("|"));
          }
        }
      }
    });
  }
  $("#page-1").click();
}

//===========DISPLAY MOVIE + IMAGE FROM THE MOVIE DB API=================
function myMovieCardWithAPI(movie, option = null) {
  let title_for_url = movie.split("|")[0].replace(/\ /g, "+");
  let title = movie.split("|")[0];
  let genre = movie.split("|")[1];
  let distrib = movie.split("|")[2];
  let id_film = movie.split("|")[3];
  let resum = movie.split("|")[4];
  let annee_prod = movie.split("|")[5];
  let url = `https://api.themoviedb.org/3/search/movie?api_key=09b47a32830cc8c808b2c69be226f81b&query=${title_for_url}&append_to_response=videos`;
  if ( option == 'by-date' ) {
    let date_debut_projection = movie.split("|")[6];
    let date_fin_projection = movie.split("|")[7];
  }

  fetch(url)
    .then(result => result.json())
    .then(data_movie_API => {
      //TRIER LES AFFICHES PAR ANNEE SI PLUSIEURS RESULTATS
      let themoviedb_id = data_movie_API.results[0].id;
      let movie_poster_url_end = data_movie_API.results[0].poster_path;
      if (title == "War") {
        movie_poster_url_end = data_movie_API.results[1].poster_path;
        themoviedb_id = data_movie_API.results[1].id;
      } else {
        if (data_movie_API.results.length > 1) {
          for (let i = 0; i < data_movie_API.results.length; i++) {
            if ( data_movie_API.results[i].release_date.substr(0, 4) == annee_prod ) {
              movie_poster_url_end = data_movie_API.results[i].poster_path;
              themoviedb_id = data_movie_API.results[i].id;
            }
          }
        }
      }

      //DISPLAY RESULT
      $("#result").append(`<div class='movie-result' id='${id_film}' ></div>`);
      if (movie_poster_url_end) {
        movie_poster_url = `http://image.tmdb.org/t/p/w500${movie_poster_url_end}`;
        $(`#${id_film}`).append(`<div id='${id_film}-img'></div>`);
        $(`#${id_film}-img`).append(`<img src='${movie_poster_url}' title="Poster Of : ${title}" alt='Poster Of : ${title}' id='${id_film}-src'>`
        );
      } else {
        $(`#${id_film}`).append(`<img src='img/blank.png' title="This movie doesn't have a poster :(" alt='Poster Of : ${title}' id='${id_film}-src'>`);
      }
      restOfMovieCardDescription(id_film, title, annee_prod, genre, distrib, resum, movie, themoviedb_id);
    })
    .catch(function(error) {
      $("#result").append(`<div class='movie-result' id='${id_film}'></div>`);
      $(`#${id_film}`).append(`<img src='img/blank.png' title="This movie doesn't have a poster :(" alt='Poster Of : ${title}' id='${id_film}-src'>`);
      restOfMovieCardDescription(id_film, title, annee_prod, genre, distrib, movie, resum);
    });
}

function restOfMovieCardDescription(id_film, title, annee_prod, genre, distrib, resum, movie, themoviedb_id = null) {
  $(`#${id_film}`).append(`<div class='movie-result-description' id='${id_film}-description'></div>`);
  if ( themoviedb_id == null ) {
    $(`#${id_film}-description`).append(`<h3>${title}</h3>`);
  } else {
    $(`#${id_film}-description`).append(`<h3 id='${id_film}-dbid' value='${themoviedb_id}'>${title}</h3>`);
  }
  if ( $('#title-datepicker-container') 
  && $('#title-datepicker-container').length > 0
  && movie.split("|")[6] != undefined ) {
    $(`#${id_film}-description`).append(`<p class='date' style='margin-bottom: 0.2vw;'>From: ${movie.split("|")[6]} to: ${movie.split("|")[7]}</p>`);
  }
  myHistoricIconChecker(id_film);
  $(`#${id_film}-description`).append(`<p class='date'>${annee_prod} | ${genre} | ${distrib}</p>`);
  if ( resum && resum.length > 150) {
    resum = resum.substr(0, 150) + "...";
  }
  $(`#${id_film}-description`).append(`<p>${resum}</p>`);
  $(`#${id_film}-description`).append(`<div class='seemore-container' id='${id_film}-description-seemore-container'></div>`);
  $(`#${id_film}-description-seemore-container`).append(`<p class='seemore' value='${id_film}' id='${id_film}-seemore'>More About The Movie</p>` );
  showMovieOnClick(id_film);
  if ( $('#title-my-reviews') && $('#title-my-reviews').length > 0 ) {
    displayReviewsAccount(movie);
  }
}

function showMovieOnClick(id_film) {
  $(`#${id_film}-seemore`).click(function(e) {
    requestPHP("movie-info", id_film); 
  });
}

function myHistoricIconChecker(id_film) {
  if ( verifyLocalStorage('check') == true ) {
      id = localStorage.User + "|" + id_film;
      requestPHP('verify-if-movie-in-historic', id);
    }
}

function myHistoricIconMaker(is_the_movie_in_the_historic, id) {
  let id_film = id.split('|')[1];
  if ( is_the_movie_in_the_historic == 'Nothing' ) {
    $(`#${id_film}-seen`).remove();
    $(`#${id_film} h3`).after(
    `<img src='img/notseen.png' alt='Historic Checker' title='This movie is not in your historic. Click to mark it as seen.' class='historic-icon' id='${id_film}-notseen' value='notseen'>`); 
    myOnClick(`#${id_film}-notseen`, addMovieToHistoric, id);
  } else {
    $(`#${id_film}-notseen`).remove();
    $(`#${id_film} h3`).after(
    `<img src='img/seen.png' alt='Historic Checker' title='This movie is in your historic. Click to delete it.' class='historic-icon' id='${id_film}-seen' value='seen'>`); 
    myOnClick(`#${id_film}-seen`, removeMovieFromHistoric, id);
  }
}

function addMovieToHistoric(id) {
  let id_user = id.split('|')[0];
  let id_film = id.split('|')[1];
  console.log(`PHP Request for user ${id_user} about movie ${id_film}`);
  requestPHP('add-movie-historic', id);
}

function removeMovieFromHistoric(id) {
  let id_user = id.split('|')[0];
  let id_film = id.split('|')[1];
  console.log(`PHP Request to remove movie ${id_film} from user n ${id_user} historic`);
  requestPHP('remove-movie-historic', id_film);
}

//MOVIE PAGE INFO
function moviePage(data) {
  var data = data[0].split("|");
  let id_film = data[0];
  let id_genre = data[1];
  let id_distrib = data[2];
  let titre = data[3];
  let resum = data[4];
  let date_debut_affiche = data[5];
  let date_fin_affiche = data[6];
  let duree_min = data[7];
  let annee_prod = data[8];
  let genre = data[10];
  let distrib = data[12];
  let poster_url = '';
  if ( $(`#${id_film}-src`)[0] ) {
    poster_url = $(`#${id_film}-src`)[0].src;
  }
  let themoviedb_id = $(`#${id_film}-dbid`).attr("value");
  let vid_url_request = `http://api.themoviedb.org/3/movie/${themoviedb_id}/videos?api_key=09b47a32830cc8c808b2c69be226f81b`;

  fetch(vid_url_request) 
    .then(result => result.json())
    .then(data_video_API => {
      $("div#main-container").after(
        `<div id='main-movie-container' class='container-movie-style'></div>`);
      $("div#main-container").hide();
      $("div#date-picker-container").hide();
      $("#main-movie-container").append(
        `<button id='goback' class='btn'>Revenir à la recherche</button>`);
      $("#main-movie-container").append(`<div id='main-movie' class='container-style'></div>`);
      $("#main-movie-container").css("color", "white");
      if (poster_url) {
        $("#main-movie-container").css(
          "background-image",
          `radial-gradient(circle at 20% 50%, rgba(12.94%, 14.90%, 22.75%, 0.98) 0%, rgba(20.39%, 22.35%, 29.02%, 0.88) 100%), url(${poster_url})`
        );
        $("#main-movie").append(
          `<img src='${poster_url}' alt='Poster Of : ${titre}'>`
        );
      } else {
        $("#main-movie-container").css(
          "background-image",
          `radial-gradient(circle at 20% 50%, rgba(12.94%, 14.90%, 22.75%, 0.98) 0%, rgba(20.39%, 22.35%, 29.02%, 0.88) 100%), url(${poster_url})`
        );
      }
      $("#main-movie").append(`<div id='movie-inf-container'></div>`);
      if (titre) {
        $("#movie-inf-container").append(`<h1 id='title-mov'>${titre}</h1>`);
      }
      if (annee_prod) {
        $("#movie-inf-container").append(
          `<p id='annee_prod-movie-page'>${annee_prod}</p>`);
      }
      if (duree_min) {
        $("#movie-inf-container").append(
          `<p id='duree-movie-page'>Durée : ${duree_min} min</p>`);
      }
      if (genre) {
        $("#movie-inf-container").append(
          `<p id='resum'>Genre : \n${genre}</p>`);
      }
      if (distrib) {
        $("#movie-inf-container").append(
          `<p id='distrib-movie-page'>Distributor : \n${distrib}</p>`);
      }
      if (resum) {
        $("#movie-inf-container").append(
          `<p id='resum-movie-page'>Synopsis: \n${resum}</p>`);
      }

      if (data_video_API.results && data_video_API.results.length != 0) {
        let yt_id = data_video_API.results[0].key;
        let yt_url = `https://www.youtube.com/embed/${yt_id}`;
        let iframe = `<iframe width="560" height="315" src="${yt_url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        $("#movie-inf-container").append(iframe);
      }

      if ( $(`#${id_film}-seen`) && $(`#${id_film}-seen`).length > 0 ) {
        console.log(`The movie ${titre} has been seen. Here are the comments.`);
        let comment = `<textarea id='write-review' type='text' name='write-review' class='write-review-textarea' rows="5" cols="33" maxlength="500" placeholder="My opinion on this movie will be heard!"></textarea>`;
        $("#main-movie-container").append(`<div id='review-container' class='container-style'></div>`);
        $("#review-container").append(comment);
        $("#review-container").append(`<button id='${id_film}-review-btn' class='btn btn-review'>Publish My Review</button>`);
        myOnClick(`#${id_film}-review-btn`, publishReview, id_film);
      }

      $(`#goback`).click(function() {
        $("#main-movie-container").remove();
        $("div#main-container").show();
        $("div#date-picker-container").show();
      });
    });
}

function publishReview(id_film) {
  let reviewContent = $('#write-review').val();
  let id = id_film + '|' + reviewContent.html() + '|' + localStorage.User;
  console.log('This review will be published: ' + reviewContent);
  requestPHP('publish-review', id);
}