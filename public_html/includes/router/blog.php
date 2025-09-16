<?php

// If it's trying to access a blog entry, serve a match
function handleBlogRequests(string $path) {
    $matches = [];
    if (preg_match('/^blog(\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[-a-z0-9]*)$/', $path, $matches)) {
        $config = Configuration::getInstance();
        $GLOBALS['permalink'] = $matches[1];
        ob_start();
        include 'blog/post.php';
        $config->pageContent = ob_get_clean();
        require_once $config->pageTemplate;
        exit;
    }
}

?>