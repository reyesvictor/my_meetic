<?php

class GetList extends PDO {
  protected $user_info;
  protected $email;
  protected $dbh;
  protected $sql;
  protected $sth;
  protected $pwd_crypted;
  protected $user_hobbies_only;
  protected $user_id;
  protected $list;
  protected $listToReturn;

  public function __construct($option) {
    $this->connectDB();
    $this->fetchList($option);
    $this->cleanResult();
  }
  
  protected function connectDB(){
    $this->dbh = new PDO('mysql:host=127.0.0.1;dbname=my_meetic;', 'root', '');
    if (mysqli_connect_errno()) 
    { 
      echo "Database connection failed."; 
      exit();
    } 
  }

  protected function fetchList($option) {
    $sql = "SELECT * FROM {$option};";
    $this->executeRequestandReturnList($sql);
  }

  protected function executeRequestandReturnList($sql) {
    $sth = $this->dbh->prepare($sql);
    $sth->execute();
    $this->list = $sth->fetchAll();
  }

  protected function cleanResult() {
    foreach ( $this->list as $key => $value ) {
      $name = $this->list[$key][1];
      $value = $this->list[$key][0];
      $this->listToReturn[$this->list[$key][1]] = $this->list[$key][0];
    }
  }

  public function getList() {
    return $this->listToReturn;
  }
  
}