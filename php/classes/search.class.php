<?php

class Search {
  protected $all_options = [];
  protected $sql;
  protected $dbh;
  protected $user_id;
  protected $email;
  protected $members_list_info;
  protected $list_users_ids;
  protected $city;


  public function __construct(){
    $this->dbh = new PDO('mysql:host=127.0.0.1;dbname=my_meetic;', 'root', '');
    if (mysqli_connect_errno()) 
    { 
      echo "Database connection failed."; 
      exit();
    } 
  }

  public function get_user_id($email) {
    $this->sql = "SELECT id_user FROM user_info WHERE email = '{$email}';";
    $this->user_id = $this->return_result();
    return $this->user_id[0]['id_user'];
  }

  public function get_all($email) {
    $this->email = $email;
    $this->sql_genre_request();
    $this->execute_request_and_push_into_array();
    $this->sql_city_request();
    $this->execute_request_and_push_into_array();
    $this->sql_hobbies_request();
    $this->execute_request_and_push_into_array();
    return $this->all_options;
  }

  private function sql_genre_request() { //pas utile ici
    $this->sql = "SELECT * from genre";
  }

  private function sql_city_request() { //pas utile ici
    $this->sql = "SELECT distinct city from user_info;";
  }

  private function sql_hobbies_request() { //pas utile ici
    $this->sql = "SELECT * from hobbies;";
  }

  private function execute_request_and_push_into_array() {
    $sth = $this->dbh->prepare($this->sql);
    $sth->execute();
    array_push($this->all_options, $sth->fetchAll(PDO::FETCH_ASSOC));
  }

  private function return_result() {
    $sth = $this->dbh->prepare($this->sql);
    $sth->execute();
    return $sth->fetchAll(PDO::FETCH_ASSOC);
  }

  //SEARCH MEMBERS
  public function get_members($hobbies, $age, $gender, $city, $email) {
    $this->city = $city;
    $this->hobbies = $hobbies;
    $this->sql="SELECT distinct id_user from user_info join user_hobbies using (id_user) 
    right join genre g using(id_genre) right join hobbies h using(id_hobbie)
    where  {$this->sql_condition_generator($city, 'city')}
    {$this->sql_condition_generator($hobbies, 'id_hobbie', "AND")}
    (id_genre = '{$gender}') 
    AND ({$this->sql_age($age)})
    AND email <> '{$email}' ;";
    $this->list_users_ids = $this->return_result($this->sql);
    foreach ($this->list_users_ids as $key => $user) {
      $this->members_list_info[$user['id_user']] = [];
      array_push($this->members_list_info[$user['id_user']], $this->getUserPrivateInformation($user['id_user']));
      array_push($this->members_list_info[$user['id_user']], $this->getUserHobbies($user['id_user']));
    }
    return $this->members_list_info;
  }

  private function getUserPrivateInformation ($user_id) {
    //Oubli volontaire du id_genre
    $this->sql = "SELECT firstname, lastname, birthdate, g.name as 'Genre', city
    FROM user_info right join genre g using (id_genre) WHERE id_user = '{$user_id}';";
    return $this->return_result();
  }

  private function getUserHobbies($user_id) {
    $this->sql = "SELECT * FROM user_hobbies right join hobbies using (id_hobbie) where id_user = '{$user_id}';";
    return $this->return_result();
  }

  private function sql_condition_generator($var, $col, $and = ''){
    if ( $and == 'AND' && $this->city == "0" || $and == '' ) {
      $and_after_city = '';
    } else {
      $and_after_city = '';
    }
    if ( $var == 0 ) {
      return false;
    } else if ( count($var) == 1 ) {
      return "{$and_after_city} ({$col} = '{$var[0]}') AND ";      
    } else {
      for ($i=0; $i < count($var) ; $i++) { 
        if ( $i == 0 ) {
          $str = " {$and_after_city} ({$col} IN ('{$var[$i]}'";
        } else {
          $str .= ",'{$var[$i]}'";
        }
      }
      $str .= ") ) AND ";
      return $str;
    }
  }

  public function sql_age($age) {
    switch ($age){
      case 1: 
        return "TIMESTAMPDIFF( YEAR, birthdate, CURDATE() ) >= 18 AND TIMESTAMPDIFF( YEAR, birthdate, CURDATE() ) <= 25";
        break;
      case 2: 
        return "TIMESTAMPDIFF( YEAR, birthdate, CURDATE() ) >= 25 AND TIMESTAMPDIFF( YEAR, birthdate, CURDATE() ) <= 35";
        break;
      case 3: 
        return "TIMESTAMPDIFF( YEAR, birthdate, CURDATE() ) >= 35 AND TIMESTAMPDIFF( YEAR, birthdate, CURDATE() ) <= 45";
        break;
      case 4: 
        return "TIMESTAMPDIFF( YEAR, birthdate, CURDATE() ) >= 45";
        break;
    }
  }

  // private function executeRequestandReturnUserID($sql) {
  //   $sth = $this->dbh->prepare($sql);
  //   $sth->execute();
  //   $id_user = $sth->fetchAll();
  //   return $id_user[0][0];
  // }
}
