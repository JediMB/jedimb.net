<?php

namespace Services;

require_once 'services/singleton.php';
require_once 'services/database-service.php';
require_once 'models/blog-post.php';

use Models\BlogPost;
use PDOException;

class BlogPostService extends Singleton {
    public function getBlogPost(string $permalink): BlogPost|false {
        try {
            $post = DatabaseService::getInstance()->selectFunction(
                'read_blog_post', "'$permalink'"
            );
        }
        catch (PDOException $e) {
            $post['permalink'] = $permalink;
            $post['title'] = 'Error';
            $post['content'] = $e->getMessage();
        }
        finally {
            if ($post)
                return new BlogPost($post);

            return false;
        }
    }
}

?>