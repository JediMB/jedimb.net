<?php declare(strict_types=1) ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JediMB.net</title>
    
    <link rel="icon" type="image/x-icon" href="favicon.png" />
    <link href="/css/style.css" rel="stylesheet" />
</head>
<body>
    This is a test.
    <?php
        echo isset($_GET['test']) ? '<div>test=' . $_GET['test'] . '</div>' : '';
    ?>
</body>
</html>