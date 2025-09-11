<?php

require_once 'includes/services/singleton.php';
require_once 'includes/services/database-service.php';

class BlogPostService extends Singleton {
    public function getBlogPost(string $permalink) {
        try {
            $post = DatabaseService::getInstance()->selectFunction(
                'read_blog_post', "'$permalink'"
            );
        }
        catch (PDOException $e) {
            $post['title'] = 'Error';
            $post['content'] = $e->getMessage();
        }

        return $post;
    }
}

?>