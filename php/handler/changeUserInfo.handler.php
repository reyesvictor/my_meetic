<?php
include '../includes/autoloader.inc.php'; 

if ( !isset($_POST['user_info']) ) {
  header('Location: ../../');
  return false;
} else if ( isset($_POST['user_info']['pwd']) ) {
  $my_user_info = new Register($_POST['user_info']);
  $my_user_info->connectDB();
  $result = $my_user_info->changePwd();
  unset($my_user_info);
  echo json_encode($result);
} else if ( isset($_POST['user_info']['email']) ) {
  $my_user_info = new Register($_POST['user_info']);
  $my_user_info->connectDB();
  if ( $my_user_info->emailChecking($_POST['user_info']['email']) == false ) {
    $result = $my_user_info->modifyUserEmail();
  } else {
    $result = 'Email already taken.';
  }
  unset($my_user_info);
  echo json_encode($result);
}

?>