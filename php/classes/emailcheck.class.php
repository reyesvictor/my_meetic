<?php

class EmailCheck extends PDO {
  private $user_info;
  private $email;
  private $dbh;
  private $sql;
  private $sth;
  private $pwd_crypted;

  public function __construct($user_info = null) {
    $this->user_info = $user_info;
  }
  public function connectDB(){
    $this->dbh = new PDO('mysql:host=127.0.0.1;dbname=my_meetic;', 'root', '');
    if (mysqli_connect_errno()) 
    { 
      echo "Database connection failed."; 
      exit();
    } 
  }
  private function passwordCrypter($pwd) {
    $pwd_crypted = password_hash($pwd, PASSWORD_BCRYPT, array('cost'=>12));
    return $pwd_crypted;
  }

  public function createNewUser() {
    try {
      $this->pwd_crypted = $this->passwordCrypter($this->user_info['pwd']);
      $sql = "INSERT INTO user_info (firstname, lastname, birthdate, genre, city, email, pwd, main_hobbie, pwd_crypted) 
         VALUES ('{$this->user_info['firstname']}', 
         '{$this->user_info['lastname']}', 
         '{$this->user_info['birthdate']}', 
         '{$this->user_info['genre']}', 
         '{$this->user_info['city']}', 
         '{$this->user_info['email']}', 
         '{$this->user_info['pwd']}', 
         '{$this->user_info['main_hobbie']}',
         '{$this->pwd_crypted}' );";
      $sth = $this->dbh->prepare($sql);
      $sth->execute();
      return 'Register sucess !';
    } catch (exception $e) {
        return 'Registering new user failed : ' . $e;
    }
  }
  public function getUserInfo() {
    return $this->user_info;
  }
}


//Security
if ( !isset($_POST['email']) ) {
  header('Location: ../../');
  return false;
} 

// START
$dbh = new PDO('mysql:host=127.0.0.1;dbname=my_meetic;', 'root', '');

// CHECK CONNECTION 
if (mysqli_connect_errno()) 
{ 
  echo "Database connection failed."; 
  exit();
} 

//Delete all indesirable in array
function cleanResult($result) {
  $resultToSend = [];
  foreach ( $result as $key => $value ) {
    if ( is_int($key) ) {
      unset($result[$key]);
    }
  }
  return $result;
}

//Verify Email
if ( $_POST['email'] != '' ) {
  $email = $_POST['email'];
  $sql = "SELECT * FROM user_info WHERE email = ? ";
  $sth = $dbh->prepare($sql);
  $sth->bindParam(1, $email, PDO::PARAM_STR);
  $sth->execute();
  $result = $sth->fetchAll();
  if ( count($result) > 0 ) {
    echo json_encode( cleanResult($result[0]) );
  } else { 
    echo json_encode (false);
  }
  return;
}