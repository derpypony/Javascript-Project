<?php
session_start();
$conn = mysqli_connect('localhost', 'id9116429_liurenyu', 'lunaluna', 'id9116429_hi');
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$user = $_SESSION['username'];
$sex = $_POST['sex'];
$text = $_POST['text'];

$sql = "UPDATE profiles SET sex = '$sex', text = '$text' WHERE user = '$user'";


if (mysqli_query($conn, $sql)) {
    
    //unlink("https://liurenyu.000webhostapp.com/userprofile/$user.html");
    $myfile = fopen("./userprofile/$user.html", "w") or die("Unable to create profile!");

    $txt1 = file_get_contents('userprofile_part_1.txt');
    $txt2 = file_get_contents('userprofile_part_2.txt');
    $txt3 = file_get_contents('userprofile_part_3.txt');
    $txt4 = file_get_contents('userprofile_part_4.txt');

    fwrite($myfile, $txt1);
    fwrite($myfile, $user);
    fwrite($myfile, $txt2);
    fwrite($myfile, $sex);
    fwrite($myfile, $txt3);
    fwrite($myfile, $text);
    fwrite($myfile, $txt4);
    fclose($myfile);

    echo "Profile Updated successfully!";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

echo <<<_END
<br><br>
<a href = 'https://liurenyu.000webhostapp.com/userprofile/$user.html'>Go to Your Profile</a>
_END;
?>