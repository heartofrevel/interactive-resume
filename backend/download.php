<?php
  include ('config.php');
  $ext = $_GET['ext'];
  $filepath = "../downloads/" . $filename . "" . $ext;

    // Process download
  if(file_exists($filepath)) {
      header('Content-Description: File Transfer');
      header('Content-Type: application/pdf');
      header('Content-Disposition: attachment; filename="'.basename($filepath).'"');
      header('Expires: 0');
      header('Cache-Control: must-revalidate');
      header('Pragma: public');
      header('Content-Length: ' . filesize($filepath));
      ob_clean();
      flush();
      readfile($filepath);
      exit;
  }
  else {
    echo "File not Found";
  }
?>
