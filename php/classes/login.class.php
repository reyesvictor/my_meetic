<?php
class Login {

  protected $emailToCheck;
  protected $emailStored;
  protected $pwd_login;
  protected $dbh;
  protected $pwd_crypted;

  public function __construct($email, $pwd_login) {
    $this->emailToCheck = $email;
    $this->pwd_login = $pwd_login;
  }
  public function connectDB(){
    $this->dbh = new PDO('mysql:host=127.0.0.1;dbname=my_meetic;', 'root', '');
    if (mysqli_connect_errno()) 
    { 
      echo "Database connection failed."; 
      exit();
    } 
  }
  public function verifyUser() {
    if ( $this->verifyEmail() == true && $this->verifyPwd() == true ) { 
      return true;
    } else {
      return false;
    }
  }
  protected function verifyEmail() {
    try {
      $sql = "SELECT email from user_info WHERE email = ? ;";
      $sth = $this->dbh->prepare($sql);
      $sth->bindParam(1, $this->emailToCheck, PDO::PARAM_STR);
      $sth->execute();
      $this->emailStored = $sth->fetchAll();
      if ( count($this->emailStored) > 0 ) {
        return true;
      } else {
        return false;
      }
    } catch (exception $e) {
      return 'Registering new user failed : ' . $e;
    }
  }

  protected function verifyPwd() {
    try {
      $sql = "SELECT pwd_crypted from user_info WHERE email = ? ;";
      $sth = $this->dbh->prepare($sql);
      $sth->bindParam(1, $this->emailToCheck, PDO::PARAM_STR);
      $sth->execute();
      $this->pwd_crypted = $sth->fetchAll();
      if ( password_verify($this->pwd_login, $this->pwd_crypted[0][0]) ) {
        return true;
    } else {
        return false;
    }
    } catch (exception $e) {
      return 'Registering new user failed : ' . $e;
    }
  }
}

?>