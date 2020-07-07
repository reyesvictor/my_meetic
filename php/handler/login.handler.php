<?php
include '../includes/autoloader.inc.php'; 

if ( !isset($_POST['email']) && !isset($_POST['pwd_login']) ) {
  header('Location: ../../');
  return false;
} else {
  $loginUser = new Login($_POST['email'], $_POST['pwd_login']);
  $loginUser->connectDB();
  $result = $loginUser->verifyUser();
  unset($loginUser);
  if (  $result == true ) { 
    echo json_encode(true);
  } else {
    echo json_encode(false);
  }}

?>