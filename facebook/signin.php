<?php
session_start();
$conn = mysqli_connect('localhost', 'id9116429_liurenyu', 'lunaluna', 'id9116429_hi');
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM members WHERE  user = '$username' && pass = '$password'";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    echo "Hello $username";
    echo <<<_END
<br><br>
<a href = './userprofile/$username.html'>Go to Your Profile</a>
_END;
} else {
    echo "Please enter your username and password again";
}
mysqli_close($conn);
echo <<<_END
<br><br>
<a href = 'https://liurenyu.000webhostapp.com/index.html'>Go to front page</a>
_END;
?>