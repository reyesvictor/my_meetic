<?php
include '../includes/autoloader.inc.php'; 

if ( !isset($_POST['user_info']) ) {
  header('Location: ../../');
  return false;
} else {
  $newUser = new Register($_POST['user_info']);
  $newUser->connectDB();
  $result = $newUser->createNew();
  unset($newUser);
  echo json_encode($result);
}

?>