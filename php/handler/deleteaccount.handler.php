<?php
include '../includes/autoloader.inc.php'; 

if ( !isset($_POST['user_id']) ) {
  header('Location: ../../');
  return false;
} else {
  $my_user_info = new Account($_POST['user_id']);
  $my_user_info->connectDB();
  $result = $my_user_info->deleteUser();
  unset($my_user_info);
  echo json_encode($result);
}

?>