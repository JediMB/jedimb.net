<?php

require_once('includes/services/database.php');

function getBlogPost(string $permalink) {
    try {
        dbConnect();
        dbSelectFunction('select_blog_post', [ $permalink ]);
        $post = dbResultNextRow();
    }
    catch(Exception $e) {
        $post['title'] = 'Error';
        $post['content'] = $e->getMessage();
    }
    dbDisconnect();

    return $post;
}

?>