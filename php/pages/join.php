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
</head>
<body>
  <div id="join-container">
    <div id="join-logo" class='container'><img src="../../img/logojojo1.png" alt="Website Logo" id='logo-login'></div>
    <div id="join-content">
      <div id="join-title" class='container'>
        <h1 id='join-title-h1'>Let's start !</h1>
        <h2 id='join-subtitle'></h2>
      </div>
      <div id="form-container" class='container'>
      <div id="join-form">
        <input type="text" name='firstname' id="join-0" class='join-text-input' placeholder='What is your first name ?' required>
        <input type="text" name='lastname' id="join-1" class='join-text-input' placeholder='What is your last name ?' required>
        <input type="date" name='birthdate' onkeydown='return false' id="join-2" class='join-text-input' placeholder='What is your birthdate ?' min='1940-01-01' max='2002-12-31' required>
        <select id="join-3" name='id_genre'>
          <option disabled selected value>What is your genre ?</option>
        </select>
        <input type="text" name='city' id="join-4" class='join-text-input' placeholder='What city are you from ?' required>
        <input type="text" name='email' id="join-5" class='join-text-input' placeholder='What is your email ?' required>
        <input type="password" id="join-6" class='join-text-input' placeholder='What is your password ?' required>
        <input type="password" name='pwd' id="join-7" class='join-text-input' placeholder='Please confirm your password.' required>
        <select id="join-8" name='fav_hobbie'>
          <option disabled selected value>What is your favourite hobbie ?</option>
        </select>
        <div id="join-9">
          <button id="join-9-btn-submit" class='btn'>Register me !</button>
        </div>
      </form>
      </div>
    </div>
  </div>
</body>
<script type='text/javascript' src='../../js/jquery.uncompressed.3.4.1.js'></script>
<script type='text/javascript' src='../../js/script.js'></script>
<script type='text/javascript' src='../../js/join.js'></script>
</html>