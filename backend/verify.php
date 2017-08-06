<?php
  require_once("mailer-lib/Mail.php");
  include ('config.php');

  $email = $_GET['email'];
  $token = $_GET['token'];

  $conn = new mysqli($servername, $username, $password, $dbname);
  // Check connection
  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
  }

  $sql = "UPDATE users SET flag = 'V' WHERE email = '" . $email . "' AND token = '" . $token . "'";

  $conn->query($sql);

  $sql = "SELECT * FROM users WHERE email = '" . $email . "' AND token = '" . $token . "'";

  $result = $conn->query($sql);

  if ($result->num_rows > 0) {

    $row = mysqli_fetch_assoc($result);

    $to = "Anshul Gupta <anshul.edu@live.com>";
    $from = $sender;
    $subject = "Job Offer : " . $row['company'];
    $body = "Name : " . $row['name'] . " <" . $row['email'] . ">
Position : " .$row['position'] ;

    $headers = array('From' => $from, 'To' => $to, 'Subject' => $subject);

    $smtp = Mail::factory('smtp', array ('host' => $host,
                                         'port' => 587,
                                         'auth' => true,
                                         'username' => $smtp_username,
                                         'password' => $smtp_password));

    $mail = $smtp->send($to, $headers, $body);
    if ( PEAR::isError($mail) ) {
      echo "There was some problem with verifiation. Please try again later.";
    }
    else {
      echo "You have successfully verified your email id. I have received your hire request and will try to respond as soon as possible.";
    }
  }
  else{
    echo "You are not a user.";
  }
?>
