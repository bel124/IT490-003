<?php

$host="sysint490.mooo.com";

$username="sysint";

$password="Doremon.12";

$db_name="sysintdb";

$tbl_name="users";

$conn = mysql_connect("$host", "$username", "$password")or die("cannot connect");

mysql_select_db("$db_name")or die("cannot select DB");

$myusername=$_POST['usr'];

$mypassword=$_POST['pwd'];

$myusername = stripslashes($myusername);

$mypassword = stripslashes($mypassword);

$myusername = mysql_real_escape_string($myusername);

$mypassword = mysql_real_escape_string($mypassword);

$sql="select * from $tbl_name where passwd='$mypassword' AND name='$myusername'";

$result=mysql_query($sql,$conn);

$count=mysql_num_rows($result);

if ($count == 1)
{
echo ":) :) LOGIN SUCCESS :) :) ";
}

else 
{
echo ":( :( AUTHETICATION FAILURE :( :( ";
}

?>