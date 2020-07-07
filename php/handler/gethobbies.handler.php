<?php 

include '../includes/autoloader.inc.php'; 

if ( !isset($_POST['authorize']) ) {
  header('Location: ../../');
  return false;
} else {
  $listHobbies = new GetList('hobbies');
  $listToReturn = $listHobbies->getList();
  echo json_encode($listToReturn);
  unset($listHobbies);
}

?>