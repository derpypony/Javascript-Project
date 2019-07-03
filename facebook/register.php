<?php
session_start();
$conn = mysqli_connect('localhost', 'id9116429_liurenyu', 'lunaluna', 'id9116429_hi');
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$username = $_POST['username'];
$_SESSION['username'] = $username;
$password = $_POST['password'];

$sql = "INSERT INTO members VALUES ('$username', '$password')";
    $v1 = mysqli_query($conn, $sql);

$sql = "INSERT INTO profiles VALUES ('$username', '', '')";
    $v2 = mysqli_query($conn, $sql);

if ($v1 && $v2) {
    echo "New record created successfully";
    //then we create user profile
    $myfile = fopen("./userprofile/$username.html", "w") or die("Unable to create profile!");

    $txt1 = file_get_contents('userprofile_part_1.txt');
    $txt2 = file_get_contents('userprofile_part_2.txt');
    $txt3 = file_get_contents('userprofile_part_3.txt');
    $txt4 = file_get_contents('userprofile_part_4.txt');

    fwrite($myfile, $txt1);
    fwrite($myfile, $username);
    fwrite($myfile, $txt2);
    fwrite($myfile, $txt3);
    fwrite($myfile, $txt4);
    fclose($myfile);
    
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

echo <<<_END
<br><br>
<a href = './userprofile/$username.html'>Go to Your Profile</a>
_END;
?>