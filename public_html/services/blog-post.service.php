<?php declare(strict_types=1);

namespace Services;

require_once 'services/singleton.php';
require_once 'services/database.service.php';
require_once 'models/blog-post.model.php';

use PDO;
use PDOException;
use Models\BlogPost;

class BlogPostService extends Singleton {
    public function getBlogPost(string $permalink): BlogPost|false {
        try {
            $post = DatabaseService::getInstance()->selectFunction(
                'read_blog_post', [
                    1 => [ 'value' => $permalink, 'type' => PDO::PARAM_STR ]
                ]
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