<?php
include '../includes/autoloader.inc.php'; 

if ( !$_POST['verifier'] ) {
  header('Location: ../../');
  return false;
} 
else if ( $_POST['verifier'] == 'get_user_id' )  {
  $all_options = new Search();
  $result = $all_options->get_user_id($_POST['email']);
  unset($all_options);
  echo json_encode($result);
} 
else if ( $_POST['verifier'] == 'get_all_options' ) {
  $all_options = new Search();
  $result = $all_options->get_all($_POST['email']);
  unset($all_options);
  echo json_encode($result);
}

?>