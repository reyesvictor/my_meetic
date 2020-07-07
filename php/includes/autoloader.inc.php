<?php
spl_autoload_register('autoLoad');

function autoLoad($class) {
  $classPath = "../classes/{$class}.class.php";
  if ( !file_exists($classPath) ) {
    return false;
  }
  include_once $classPath;
}
?>