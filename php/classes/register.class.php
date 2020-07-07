<?php

class Register extends PDO {
  protected $user_info;
  protected $email;
  protected $dbh;
  protected $sql;
  protected $sth;
  protected $pwd_crypted;
  protected $user_hobbies_only;
  protected $user_id;

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

  protected function passwordCrypter($pwd) {
    $pwd_crypted = password_hash($pwd, PASSWORD_BCRYPT, array('cost'=>12));
    return $pwd_crypted;
  }

  public function createNew() {
    $this->user_hobbies_only = array_chunk($this->user_info, 8)[1];
    $this->createNewUser();
    $this->getUserId();
    $this->createNewUserFavHobbie();
    $this->sqlHobbiesGenerator();
  }

  private function executeRequest($sql) {
    $sth = $this->dbh->prepare($sql);
    $sth->execute();
    return 'Register success !';
  }

  private function executeRequestandReturnUserID($sql) {
    $sth = $this->dbh->prepare($sql);
    $sth->execute();
    $id_user = $sth->fetchAll();
    return $id_user[0][0];
  }

  private function createNewUser() {
    try { //bindparam ici ?
      $this->pwd_crypted = $this->passwordCrypter($this->user_info['pwd']);
      $sql = "INSERT INTO user_info (firstname, lastname, birthdate, id_genre, city, email, pwd, pwd_crypted) 
      VALUES (
         '{$this->user_info['firstname']}', 
         '{$this->user_info['lastname']}', 
         '{$this->user_info['birthdate']}', 
         '{$this->user_info['id_genre']}', 
         '{$this->user_info['city']}', 
         '{$this->user_info['email']}', 
         '{$this->user_info['pwd']}', 
         '{$this->pwd_crypted}' );";
    $this->executeRequest($sql);
    } catch (exception $e) {
      return 'Registering new user failed : ' . $e;
    }
  }
   
  private function getUserId() {
      $sql = "SELECT id_user FROM user_info WHERE email = '{$this->user_info['email']}';";
      $this->user_id = $this->executeRequestandReturnUserID($sql);
  }

  private function createNewUserFavHobbie() {
    $sql = "INSERT INTO user_hobbies (id_user, id_hobbie, fav_hobbie) VALUES ({$this->user_id}, {$this->user_info['fav_hobbie']}, 1)";
    $this->executeRequest($sql);
  }

  private function sqlHobbiesGenerator() { 
    for ($i=0; $i < count($this->user_hobbies_only); $i++) { 
        $sql = "INSERT INTO user_hobbies (id_user, id_hobbie) VALUES ('{$this->user_id}', '{$this->user_hobbies_only[$i]}')";
        $this->executeRequest($sql);
    }
  }

  public function getUserInfo() {
    return $this->user_info;
  }
  
  public function emailChecking($email) {
    $sql = "SELECT * FROM user_info WHERE email = ? ";
    $sth = $this->dbh->prepare($sql);
    $sth->bindParam(1, $email, PDO::PARAM_STR);
    $sth->execute();
    $result = $sth->fetchAll();
    if ( count($result) > 0 ) {
      return $this->cleanResult($result[0]);
    } else { 
      return false;
    }
  }

  public function modifyUserEmail() {
    $sql = "UPDATE user_info set email='{$this->user_info['email']}' where id_user={$this->user_info['user_id']};";
    try {
      $this->executeRequest($sql);
      return 'Email modification succefully done.';
    } catch (Exception $e) {
      return 'Email modification failed : ' . $e;
    }
  }

  protected function cleanResult($result) {
    foreach ( $result as $key => $value ) {
      if ( is_int($key) ) {
        unset($result[$key]);
      }
    }
    return $result;
  }

  public function changePwd() {
    $this->pwd_crypted = $this->passwordCrypter($this->user_info['pwd']);
    $sql = "UPDATE user_info set pwd='{$this->user_info['pwd']}', pwd_crypted='{$this->pwd_crypted}' where id_user={$this->user_info['user_id']};";
    try {
      $this->executeRequest($sql);
      return 'Password modification succefully done.';
    } catch (Exception $e) {
      return 'Modification of password failed : ' . $e;
    }
  }
}
