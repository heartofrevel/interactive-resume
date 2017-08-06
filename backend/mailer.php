<?php
    require_once("mailer-lib/Mail.php");
    include ('config.php');

    function random_str($length, $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'){
      $str = '';
      $max = mb_strlen($keyspace, '8bit') - 1;
      for ($i = 0; $i < $length; ++$i) {
          $str .= $keyspace[random_int(0, $max)];
      }
      return $str;
    }

    $_POST = json_decode(file_get_contents('php://input'), true);

    $name = $_POST["name"];
    $email = $_POST["email"];
    $company = $_POST["company"];
    $position = $_POST["position"];
    $verify_token = md5(random_str(9));
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }


    $sql = "INSERT INTO users(`name`,`email`,`company`,`position`,`token`,`flag`) VALUES('" . $name . "','" . $email . "','" . $company  . "','" . $position  . "','" . $verify_token . "','N')";

    if ($conn->query($sql) === TRUE) {
      $to = $name . " <" . $email . ">";
      $from = $sender;
      $subject = "Email Verification : anshul.online";
      $link = "https://anshul.online/cv/backend/verify.php?email=" . $email . "&token=" . $verify_token;
      $body = "Hi " . $name . ",
Please click the following link for verification.
" . $link . "
Please note that I will receive your hire request only if you verify your email.";

      $headers = array('From' => $from, 'To' => $to, 'Subject' => $subject);

      $smtp = Mail::factory('smtp', array ('host' => $host,
                                           'port' => 587,
                                           'auth' => true,
                                           'username' => $smtp_username,
                                           'password' => $smtp_password));

      $mail = $smtp->send($to, $headers, $body);
      if ( PEAR::isError($mail) ) {
        echo "MSE";
      }
      else {
        echo "OK";
      }
    }
    else {
      echo "IE";
    }

?>
