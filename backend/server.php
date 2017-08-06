<?php
include ('config.php');

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$json_array = array();


switch ($_POST['command']){
  case "education":
    $sql = "SELECT id, name, place, year, description FROM education";
    break;
  case "experience":
    $sql = "SELECT id, name, role, place, toTime, fromTime, description FROM experience";
    break;
  case "projects":
    $sql = "SELECT * FROM projects";
    break;
  case "certifications":
    $sql = "SELECT * FROM certifications";
    break;
  case "honors":
    $sql = "SELECT * FROM honors";
    break;
  case "skills":
    $sql = "SELECT * FROM skills";
    break;
}

$result = $conn->query($sql);


if ($result->num_rows >0){
  while($row = mysqli_fetch_assoc($result)){
    $json_array[] = $row;
  }
}
else {
  $json_array['msg'] = "NR";
}

echo json_encode($json_array);

$conn->close();
?>
