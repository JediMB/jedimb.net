<?php

require_once 'includes/services/singleton.php';
require_once 'includes/services/database-service.php';

class BlogPostService extends Singleton {
    private DatabaseService $service;

    protected function __construct() {
        $this->service = DatabaseService::getInstance();
    }

    public function getBlogPost(string $permalink) {
        $db = $this->service;

        try {
            $db->connect();
            $db->selectFunction('select_blog_post', [ $permalink ]);
            $post = $db->nextRow();
        }
        catch(Exception $e) {
            $post['title'] = 'Error';
            $post['content'] = $e->getMessage();
        }
        finally {
            $db->disconnect();
        }

        return $post;
    }
}

?>