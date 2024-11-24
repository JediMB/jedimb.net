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
    <header class="bg-gradient-to-br px-16 py-8 rounded-b-2xl" style="--tw-gradient-stops: #111 0 15%, #333;">
        <nav id="menu-top">
            <ul class="flex gap-2 justify-end">
                <li><?php menuButton('test', 'Projects') ?></li>
                <li><?php menuButton('about:blank', 'About me') ?></li>
            </ul>
        </nav>
    </header>
    <div class="mt-4">
        <!-- Scrap this and just make drop-down menus -->
        <!--
            Alternatively, have a transparent (no-bg) row below the header that expands and pushes
            the page content downwards as you hover over the button. Then, when you click on it,
            a series of "cards" slide in from the side(s) to form the sub-menu in that space
        -->
        <nav id="menu-left" class="bg-black w-60 p-8 rounded-2xl">
            <ul>
                <li>Project 1</li>
                <li>Project 2</li>
                <li>Project 3</li>
                <li>Project 4</li>
                <li>Project 5</li>
                <li>Project 6</li>
            </ul>
        </nav>
        <main>

        </main>
    </div>
</body>
</html>