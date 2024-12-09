<?php 
    function menuButton($url, $text)
    {
        echo <<<HTML
        <a href="$url" class="btn btn-menu">$text</a>
        HTML;
    }
?>