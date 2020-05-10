<html>
<head>
<title>Login</title>
<style>
    form {display: inline;}    
</style>
    
<script>
    function handleloginResponse(response)
{
    var text = JSON.parse(response)
    document.getElementById("textResponse").innerHTML = "response: "+text+"<p>";
}

function sendLoginRequest(username,password)
{
    var request = new XMLHttpRequest();
    request.open("POST","sec.php",true);
    request.setRequestHeader("content-Type","application/x-www-form-urlencoded");
    request.onreadystatechange=function()
    {
        if ((this.readyState == 4)&&(this.status == 200))
            {
                handleloginResponse(this.responseText);
            }
    }
    request.send("type=login&uname="+username+"&pword="+password);
}
</script>
    
    
<body>

<link href=‘login.css’ rel=‘stylesheet’ type=‘test/css’>
<form class=“login-box’>
    <div class=“login-title’>

<br>
        <h2>Welcome</h2>
    </div>
    <div class=“login-area”>
        <h3>username:</h3>
        <input type=“test”    name=“username”  placeholder=“username” required />
        <br>
        <h3>Password:</3>
        <input type=“password”  name=“password”   placeholder=“password” required />
        <br>
        <button type=“submit”>Login</button>

   </form>
    <form method=“POST” action=“register.html”>
        <button type=“submit”>Register</button>

   </div>
</div>
</form>

<script>
</script>
</body>
</head>
</html>

