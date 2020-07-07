<?php
include '../includes/autoloader.inc.php'; 

if ( !isset($_POST['user_id']) ) {
  header('Location: ../../');
  return false;
} else {
  $my_user_info = new Account($_POST['user_id']);
  $my_user_info->connectDB();
  $user_data = $my_user_info->getUserInformation();
  unset($my_user_info);
  echo json_encode($user_data);
}

?>