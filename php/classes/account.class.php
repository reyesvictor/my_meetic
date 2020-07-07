<?php
class Account {

  private $user_id;
  private $user_info;

  public function __construct($user_id) {
    $this->user_id = $user_id;
  }

  public function connectDB(){
    $this->dbh = new PDO('mysql:host=127.0.0.1;dbname=my_meetic;', 'root', '');
    if (mysqli_connect_errno()) 
    { 
      echo "Database connection failed."; 
      exit();
    } 
  }

  private function exeRequest($sql) {
    $sth = $this->dbh->prepare($sql);
    $sth->execute();
    return $sth->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getUserInformation() {
    $this->getUserPrivateInformation();
    $this->getUserHobbies();
    return $this->user_info;
  }

  private function getUserPrivateInformation () {
    //Oubli volontaire du id_genre
    $sql = "SELECT firstname, lastname, id_user as 'User ID', birthdate, g.name as 'Genre', city, email, pwd as 'Password' 
    FROM user_info right join genre g using (id_genre) WHERE id_user = '{$this->user_id}';";
    $this->user_info = $this->exeRequest($sql);
  }

  private function getUserHobbies() {
    $sql = "SELECT * FROM user_hobbies right join hobbies using (id_hobbie) where id_user = '{$this->user_id}';";
    array_push($this->user_info, $this->exeRequest($sql));
  }

  public function deleteUser() {
    $sql = "DELETE ui, uh from user_info ui JOIN user_hobbies uh using(id_user) WHERE id_user = '{$this->user_id}';";
    try {
      $this->user_info = $this->exeRequest($sql);
      return 'User succesfully deleted.';
    } catch (Exception $e) {
      return 'Caught exception: '.   $e->getMessage() .  "\n";
    }
  }
}

?>