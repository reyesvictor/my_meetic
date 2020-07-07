<?php 

include '../includes/autoloader.inc.php';

if ( !$_POST['verifier'] ) {
  header('Location: ../../');
  return false;
} 
else if ( $_POST['verifier'] == 'get_members_from_prefs' )  {
  $members = new Search();
  $result = $members->get_members($_POST['hobbies'], $_POST['age'],$_POST['gender'], $_POST['city'], $_POST['email']);
  unset($members);
  echo json_encode($result);
} 

?>