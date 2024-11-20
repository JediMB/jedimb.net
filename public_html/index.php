<?php declare(strict_types=1) ?>

<?php
    include './components/menu-button.php';
?>

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
    <header class="bg-black px-16 py-8 rounded-full">
        <nav>
            <ul class="flex gap-2 justify-end">
                <li><?php menuButton('about:blank', 'Projects') ?></li>
                <li><?php menuButton('about:blank', 'About me') ?></li>
            </ul>
        </nav>
    </header>
</body>
</html>