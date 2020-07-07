<?php

// START
$dbh = new PDO('mysql:host=127.0.0.1;dbname=cinema;', 'root', '');

// CHECK CONNECTION 
if (mysqli_connect_errno()) 
{ 
  echo "Database connection failed."; 
  exit();
} 

//VAR
$arr = [];
$str = '';
$meta = '';

//SELECTING SQL SENTENCE
function filter() {
  switch ($_POST['filter']) {
    case 'film': return 'f.titre'; break;
    case 'genre': return 'g.nom'; break;
    case 'distrib': return 'd.nom'; break;
    case 'search-m-filter-id-null': return 'members'; break;
  } 
}

function sql_condition($filter) {

  $search = $_POST['search'];
  if ( strpos($search, ' ') != false ) { //If multiple words.
    $words = explode(' ', $search);
    for ($i = 0; $i < count($words); $i++ ) {
      if( $i == 0 ) {
            if ( strlen($filter) > 0 ) { //MOVIES
              $search = " (UPPER({$filter}) LIKE BINARY UPPER('%{$words[$i]}%')) ";
            }
            else { //MEMBER NAMES
              $search = " (UPPER(fp.prenom) LIKE BINARY UPPER('%{$words[$i]}%') OR UPPER(fp.nom) LIKE BINARY UPPER('%{$words[$i]}%') ) ";
            }
          }
          else {
            $filter != 'members' ? 
              //MOVIES
              $search .= "AND (UPPER({$filter}) LIKE BINARY UPPER('%{$words[$i]}%')) "
              : //MEMBER NAMES
              $search .= "AND (UPPER(fp.prenom) LIKE BINARY UPPER('%{$words[$i]}%') OR UPPER(fp.nom) LIKE BINARY UPPER('%{$condition[$i]}%') ) ";
          }
        }
        return $search;
      }
      else { //If only one word
        return $filter != 'members' ?  
        "(UPPER({$filter}) LIKE BINARY UPPER('%{$search}%')) " : 
        "(UPPER(fp.prenom) LIKE BINARY UPPER('%{$search}%') OR UPPER(fp.nom) LIKE BINARY UPPER('%{$search}%') )";
      }
    }
      
    switch ($_POST['sql_opt']) {
      case 'search': //ne pas changer l'ordre pour el split de la fonction recup API images
        $sql_opt = "SELECT f.titre, d.nom, g.nom, f.id_film, f.resum, f.annee_prod
        FROM film f 
        LEFT JOIN distrib d ON f.id_distrib = d.id_distrib 
        LEFT JOIN genre g ON f.id_genre = g.id_genre
        WHERE " . sql_condition(filter()) . " ORDER BY f.titre;"; // a pouvoir modifier si possible...
      break;
      case 'search-member': 
        $sql_opt = "SELECT fp.prenom, fp.nom, fp.id_perso, m.id_membre 
        FROM fiche_personne fp 
        LEFT JOIN membre m ON m.id_fiche_perso = fp.id_perso 
        WHERE " . sql_condition(filter()) . ";"; 
      break;
      case 'member-historic': 
        $sql_opt = "SELECT fp.prenom, fp.nom, fp.id_perso, m.id_fiche_perso, m.id_membre, h.id_film, h.date, f.id_film, f.titre, g.nom, f.resum, f.annee_prod, d.nom
        FROM fiche_personne fp LEFT JOIN membre m ON fp.id_perso = m.id_fiche_perso 
        LEFT JOIN historique_membre h ON m.id_membre = h.id_membre 
        LEFT JOIN film f ON f.id_film = h.id_film 
        LEFT JOIN distrib d ON f.id_distrib = d.id_distrib 
        LEFT JOIN genre g ON f.id_genre = g.id_genre
        WHERE id_perso = " . $_POST['search'] . " ORDER BY h.date DESC;"; 
      break;
      case 'newmovies': 
        $sql_opt = "SELECT f.titre, d.nom, g.nom, f.id_film, f.resum, f.annee_prod
        FROM film f 
        LEFT JOIN distrib d ON f.id_distrib = d.id_distrib 
        LEFT JOIN genre g ON f.id_genre = g.id_genre 
        ORDER BY f.annee_prod DESC LIMIT 10;"; 
      break;
      case 'search-membersubscriptionbyid': 
        $sql_opt = "SELECT id_membre, fp.prenom, fp.nom, a.id_abo, a.nom, a.resum, a.prix, a.duree_abo 
        FROM membre m 
        LEFT JOIN abonnement a ON m.id_abo = a.id_abo 
        LEFT JOIN fiche_personne fp ON m.id_fiche_perso = fp.id_perso 
        WHERE m.id_membre = {$_POST['search']};";
      break;
      case 'subscription-modif': 
        $arr = explode('|', $_POST['search']);
        $sql_opt = "UPDATE membre m SET m.id_abo = {$arr[1]}
        WHERE id_membre = {$arr[0]} ;";
      break;
      case 'movie-info': 
        $sql_opt = "SELECT * FROM film f 
        LEFT JOIN genre g ON f.id_genre = g.id_genre 
        LEFT JOIN distrib d ON f.id_distrib = d.id_distrib 
        WHERE f.id_film = {$_POST['search']};";
      break;
      case 'perso-connection': 
        $sql_opt = "SELECT * FROM fiche_personne 
        WHERE id_perso = {$_POST['search']};"; 
      break;
      case 'verify-if-movie-in-historic':
        $arr = explode('|', $_POST['search']);
        $sql_opt = "SELECT hm.id_film
        FROM fiche_personne fp 
        LEFT JOIN membre m ON fp.id_perso = m.id_fiche_perso 
        LEFT JOIN historique_membre hm ON hm.id_membre= m.id_membre 
        WHERE id_perso = {$arr[0]} AND hm.id_film = {$arr[1]};";
      break;
      case 'add-movie-historic': //$meta will be a boolean
        $arr = explode('|', $_POST['search']);
        $id_perso = $arr[0];
        $id_movie = $arr[1];
        $sql_opt = "INSERT INTO historique_membre(id_membre, id_film, date) 
        VALUES ( 
          (SELECT m.id_membre FROM membre m 
          LEFT JOIN fiche_personne fp ON m.id_fiche_perso=fp.id_perso 
          WHERE fp.id_perso = {$id_perso} ), 
          $id_movie, 
          CURDATE()
        );";
      break;
      case 'remove-movie-historic': //$meta will be a boolean
        $id_film = $_POST['search'];
        $sql_opt = "DELETE FROM historique_membre WHERE id_film = $id_film;";
      break;
      case 'movies-by-proj-date':
        $date = $_POST['search'];
        $sql_opt = "SELECT f.titre, d.nom, g.nom, f.id_film, f.resum, f.annee_prod, f.date_debut_affiche, f.date_fin_affiche,
        DATE_FORMAT(f.date_debut_affiche, '%d-%m-%Y') AS 'Date de debut', 
        DATE_FORMAT(f.date_fin_affiche, '%d-%m-%Y') AS 'Date de fin' 
        FROM film f
        LEFT JOIN distrib d ON f.id_distrib = d.id_distrib 
        LEFT JOIN genre g ON f.id_genre = g.id_genre
        WHERE ('$date' BETWEEN f.date_debut_affiche AND f.date_fin_affiche)
        AND (f.date_debut_affiche IS NOT NULL);";
      break;
      case 'publish-review':
        $arr = explode('|', $_POST['search']);
        $id_film = $arr[0];
        $reviewContent = $arr[1];
        $id_perso = $arr[2];
        $sql_opt = "UPDATE historique_membre SET avis = '$reviewContent'
        WHERE id_film = '$id_film'
        AND id_membre = (SELECT m.id_membre FROM membre m LEFT JOIN fiche_personne fp ON m.id_fiche_perso=fp.id_perso WHERE fp.id_perso = '$id_perso');";
        $meta = '';
        $select = $dbh->query($sql_opt);
        $meta = $select->fetchall();
        echo json_encode('Review has been added.');
        return;          
      break;
      case 'user-reviews': 
        $id_perso = $_POST['search'];	
        $sql_opt = "SELECT f.titre, d.nom, g.nom, f.id_film, f.resum, 	
        f.annee_prod, f.date_debut_affiche, f.date_fin_affiche, hm.id_membre, hm.avis, hm.date	
        FROM historique_membre hm 	
        LEFT JOIN film f ON f.id_film=hm.id_film 	
        LEFT JOIN distrib d ON f.id_distrib = d.id_distrib 	
        LEFT JOIN genre g ON f.id_genre = g.id_genre 	
        WHERE hm.id_membre = 	
        (SELECT m.id_membre FROM membre m 	
        LEFT JOIN fiche_personne fp ON fp.id_perso=m.id_fiche_perso	
        WHERE fp.id_perso= $id_perso) 	
        AND avis IS NOT NULL;";	
      break;
} 

//ARRAY DATA MAKER
function myArrayDataInOneString($array) {
  $str = '';
  foreach ( $array as $key2 => $movie_inf) {
    if ( is_int($key2) ) {    
      if ( array_key_last($array) ==  $key2 ) {
        $str .= $movie_inf;
      } else {
        $str .= $movie_inf . '|';
      }
    }
  }
  return $str;
}

//SEND ARRAY OF DESIRED INFO TO JQUERY
$select = $dbh->query($sql_opt);
$meta = $select->fetchall();

if ( !$meta && $_POST['sql_opt'] == 'publish-review') {
  $meta = '';
$select = $dbh->query($sql_opt);
$meta = $select->fetchall();
  echo json_encode('Review has been added.');
  return;
}
if ( !$meta && $_POST['sql_opt'] == 'verify-if-movie-in-historic') {
  echo json_encode('Nothing');
  return;
}

if ( $meta != '') {
foreach( $meta as $key => $info_arr ) {
  if ( is_int($key) ) {
    switch ($_POST['sql_opt']) {
      case 'search': 
        $title = $info_arr[0];
        $distrib = $info_arr[1]; 
        $genre = $info_arr[2];
        $id_film = $info_arr[3];
        $resum = $info_arr[4];
        $annee_prod = $info_arr[5];
        $str = $title . '|' . $genre . '|' . $distrib  . '|' . $id_film  . '|' . $resum . '|' . $annee_prod;
      break;
      case 'search-member': 
        $prenom = $info_arr[0];
        $nom = $info_arr[1]; 
        $id_perso = $info_arr[2]; 
        $id_member = $info_arr[3]; 
        $str = ucfirst($prenom) . '|' . ucfirst($nom) . '|' . $id_perso . '|' . $id_member; 
      break;
      case 'member-historic': 
        $prenom = ucfirst($info_arr[0]);
        $nom = ucfirst($info_arr[1]); 
        $id_perso = $info_arr[2]; 
        $id_fiche_perso = $info_arr[3]; 
        $id_membre = $info_arr[4]; 
        $id_film = $info_arr[5]; 
        $date = $info_arr[6]; 
        $id_film_verif = $info_arr[7]; 
        $title = $info_arr[8]; 
        $genre = $info_arr[9]; 
        $resum = $info_arr[10];
        $annee_prod = $info_arr[11];
        $distrib = $info_arr[12];
        $str = $title . '|' . $genre . '|' . $distrib  . '|' . $id_film  . '|' . $resum . '|' . $annee_prod;
      break;
      case 'newmovies': 
        $title = $info_arr[0];
        $distrib = $info_arr[1]; 
        $genre = $info_arr[2];
        $id_film = $info_arr[3];
        $resum = $info_arr[4];
        $annee_prod = $info_arr[5];
        $str = $title . '|' . $genre . '|' . $distrib  . '|' . $id_film  . '|' . $resum . '|' . $annee_prod;
      break;
      case 'search-membersubscriptionbyid': 
        $id_membre = $info_arr[0];
        $prenom = $info_arr[1]; 
        $nom = $info_arr[2]; 
        $id_abo = $info_arr[3];
        $nom_abo = $info_arr[4]; 
        $resum_abo = $info_arr[5]; 
        $prix_abo = $info_arr[6];
        $duree_abo = $info_arr[7]; 
        $str = $id_membre . '|' . ucfirst($prenom) . '|' . ucfirst($nom)  . '|' . $id_abo . '|' . $nom_abo  . '|' . $resum_abo  . '|' . $prix_abo . '|' . $duree_abo; 
      break;
      case 'movie-info': 
        $str = myArrayDataInOneString($info_arr);
      break;
      case 'perso-connection': 
        $str = myArrayDataInOneString($info_arr);
      break;
      case 'verify-if-movie-in-historic': 
        $str = myArrayDataInOneString($info_arr);
        echo json_encode($str);
        return;
      break;
      case 'movies-by-proj-date':
        $str = myArrayDataInOneString($info_arr);
      break;
      case 'user-reviews': //$meta will be a boolean
        $str = myArrayDataInOneString($info_arr);
      break;
    }
  }
  $str = html_entity_decode($str, ENT_HTML5, 'ISO-8859-15');
  $str = utf8_encode($str);
  array_push($arr, $str);
}
echo json_encode($arr);
} else if ( $_POST['sql_opt'] == 'add-movie-historic' 
        || $_POST['sql_opt'] == 'remove-movie-historic' ) {
  echo json_encode('Historic Succesfully Updated.');
}
