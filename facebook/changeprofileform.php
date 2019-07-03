<?php
session_start();
echo<<<_END
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
        <form action="https://liurenyu.000webhostapp.com/changeprofile.php" method="POST">
            Username:
_END;
           echo $_SESSION['username'];
echo<<<_END
            <br>
            <br>
            <b>Username is unchangeable!</b>  <br><br>
            Sex:<br>
            <input type="text" name="sex" ><br>
            Description:<br>
            <textarea name="text" rows="10" cols="30"></textarea><br><br>
            <input type="submit">
        </form>
</body>
</html>
_END;
?>