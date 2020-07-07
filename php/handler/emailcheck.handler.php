<?php
include '../includes/autoloader.inc.php'; 

if ( !isset($_POST['email']) ) {
  header('Location: ../../');
  return false;
} else {
  $newEmailChecking = new Register();
  $newEmailChecking->connectDB();
  $result = $newEmailChecking->emailChecking($_POST['email']);
  unset($newEmailChecking);
  echo json_encode($result);
}

?>