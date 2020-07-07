<!DOCTYPE html>
<html lang='en'>

<head>
  <meta charset='UTF-8'>
  <meta name http-equiv='X-UA-Compatible' content='ie=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>My_cinema | Welcome</title>
  <meta name='description' content='Welcome Page'>
  <meta name='keywords' content=''>
  <meta name='copyright' content=''>
  <meta name='author' content='Victor Reyes'>
  <link rel='stylesheet' type='text/css' href='../../css/style.css' media='screen' />
  <link href='https://fonts.googleapis.com/css?family=Oswald|Droid+Sans|Droid+Serif|Roboto' rel='stylesheet'>
</head>
<body>
<div id='main-menu-page-container'>
  <header>
    <p id='nav-menu-title' class='nav-item'>Menu</p>
    <nav id='search-nav'>
      <ul>
        <li id='nav-search-page' class='nav-item'>Search For Bros</li>
        <li id='nav-my-account' class='nav-item'>My Account</li>
        <li id='nav-my-logout' class='nav-item'>Logout</li>
      </ul>
    </nav>
    <div id="logo-container">
      <img src="../../img/logojojo1.png" alt="Logo" id="logojojo-search">
    </div>
  </header>
</div>

<div id="main-all-container">
  <div id='main-search-page-container'>
    <h1>Do a research.</h1>
    <h3>Age</h3>
    <select name="hobbies" id="search-age">
      <option value="1">18-25</option>
      <option value="1">25-35</option>
      <option value="1">35-45</option>
      <option value="1">45+</option>
    </select> 
    <h3>Gender</h3>
    <select name="gender" id="search-genre">
    </select>
    <div id="checkboxes">
      <div name="city" id="search-city">
        <h3>Cities</h3>
        <div id="search-city-options">
        </div>
      </div>
      <div name="hobbies" id="search-hobbies">
        <h3>Hobbies</h3>
        <div id="search-hobbies-options">
        </div>
      </div> 
    </div>    
    <button id="perform-search" class="btn">Search for my soulmate</button>
    <p id="error-no-results" class='error-input-msg'></p>
  </div>
  
  <div id='main-result-page-container'>
    <h2 id='result-research-title'></h2>
    <div id="result-container">
      <div id="arrow-left">
        <img src="" id="img-arrow-left" class='arrow-img'>
      </div>
      <div id="result-research">
        <h2>Your soulmate is waiting for you !</h2>
        <img src="../../img/findyoursoulmate.png" alt="Jojo Character" id='img-no-search-yet'>
      </div>
      <div id="arrow-right">
        <img src="" id="img-arrow-right" class='arrow-img'>
      </div>
    </div>
  </div>
</div>

<!-- user_account -->
<div id='main-user-account-container'>
  <!-- <button id='go-back-to-research' class='btn'>Go Back</button> -->
  <div id="user-container">
    <h1>My Account</h1>
  <div id="user-result">
  </div>
    <button id="delete-account" class='btn'>Delete My Account</button>
  </div>
</div>


</body>
<script type='text/javascript' src='../../js/jquery.uncompressed.3.4.1.js'></script>
<script type='text/javascript' src='../../js/script.js'></script>
<script type='text/javascript' src='../../js/join.js'></script>
<script type='text/javascript' src='../../js/search.js'></script>
<script type='text/javascript' src='../../js/account.js'></script>
<script type='text/javascript' src='../../js/menu.js'></script>
</html>