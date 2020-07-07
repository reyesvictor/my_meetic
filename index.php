<script type='text/javascript'>
//=======HOMEPAGE====== 
if ( localStorage.id ) {
  console.log('User detected');
  window.location.replace("php/pages/search.php");
  } else {
    console.log('No User detected');
  }
</script>

<!DOCTYPE html>
<html lang='en'>

<head>
  <meta charset='UTF-8'>
  <meta name http-equiv='X-UA-Compatible' content='ie=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>My_meetic | Welcome</title>
  <meta name='description' content='Welcome Page'>
  <meta name='keywords' content=''>
  <meta name='copyright' content=''>
  <meta name='author' content='Victor Reyes'>
  <link rel='stylesheet' type='text/css' href='css/style.css' media='screen' />
</head>

<body>
  <div id="home-container">
    <div id="home-logo" class='container'><img src="img/logojojo1.png" alt="Website Logo" id='logo-index'></div>
    <div id="home-content">
      <div id="home-title" class='container'><h1 id='home-title-h1'>Discover your stand partner</h1></div>
      <div id="home-subtitle" class='container'><h2>Find authentics fight partners and bros</h2></div>
      <div id="btn-container" class='container'>
        <div id="div-btn-join"><button class="btn" id='btn-join'  onclick="location.href='php/pages/join.php'">Join For Free</button></div>
        <div id="div-btn-connect"><button class="btn" id='btn-connect' onclick="location.href='php/pages/login.php'">Log In</button></div>
      </div>
    </div>
  </div>
</body>
<script type='text/javascript' src='js/jquery.uncompressed.3.4.1.js'></script>
<script type='text/javascript' src='js/index.js'></script>
</html>