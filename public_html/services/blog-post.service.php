<?php declare(strict_types=1);

namespace Services;

require_once 'enums/published-status.enum.php';
require_once 'services/singleton.php';
require_once 'services/database.service.php';
require_once 'models/blog-post.model.php';

use Enums\DBFetch;
use PDO;
use PDOException;
use Enums\PublishedStatus;
use Models\BlogPost;

class BlogPostService extends Singleton {
    private DatabaseService $dbService;

    protected function __construct() {
        $this->dbService = DatabaseService::getInstance();
    }

    // TODO: expand functionality to cover 'unpublished' and 'any'
    public function getBlogPosts(PublishedStatus $publishedStatus = PublishedStatus::Published) {
        try {
            $posts = $this->dbService->selectView('blog_posts_published', DBFetch::All);
        }
        catch (PDOException $e) {
            $posts = [ [ 'title' => 'Error', 'content' => $e->getMessage() ] ];
        }
        finally {
            if ($posts) {
                $blogPosts = [];
                foreach ($posts as $post) {
                    $blogPosts[] = new BlogPost($post);
                }
                return $blogPosts;
            }

            return [];
        }
    }

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