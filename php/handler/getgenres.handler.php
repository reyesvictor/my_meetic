<?php 

include '../includes/autoloader.inc.php'; 

if ( !isset($_POST['authorize']) ) {
  header('Location: ../../');
  return false;
} else {
  $listGenre = new GetList('genre');
  $listToReturn = $listGenre->getList();
  echo json_encode($listToReturn);
  unset($listHobbies);
}

?>