<?php

// If it's trying to access a blog entry, serve a match
function handleBlogRequests(string $path) {
    $matches = [];
    if (preg_match(REGEX_BLOG_PATH, $path, $matches)) {
        $GLOBALS['permalink'] = $matches[1];
        servePHP('blog/post.php');
    }
}

?>