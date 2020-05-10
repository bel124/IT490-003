<?php
session_start();
require_once('/home/IT490-003/MQ/path.inc');
require_once('/home/IT490-003/MQ/rabbitMQLib.inc');
require_once('/home/IT490-003/MQ/get_host_info.inc');

$client = new rabbitMQClient('/home/IT490-003/MQ/testRabbitMQ.ini',"testServer");
if (isset($argv[1]))
{
  $msg = $argv[1];
}
else
{$msg = "test message";
}


$username = $_POST["username"];
$password = $_POST["password"];
$password_hash = password_hash($password, PASSWORD_DEFAULT);
$request = array();
$request['type'] = "login";
$request['username'] = $username;
$request['password'] = $password;
$request['message'] = $msg;
$response = $client->publish($request);
error_log("Username : $username");
echo "client received response; " .PHP_EOL;
print_r($response);
echo"\n\n";
echo $argv[0]."END".PHP_EOL;
if($response == 1) {
        $_SESSION["username"] = $_POST["username"];
        header("Location:login.php");
        error_log("Redirecting to user home page");
}else{
        header("Location:faillogin.php");
        error_log("Please re-enter your username or password");
}
?>
