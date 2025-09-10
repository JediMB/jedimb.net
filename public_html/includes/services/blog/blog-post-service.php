<?php

require_once 'includes/services/singleton.php';
require_once 'includes/services/database-service.php';

class BlogPostService extends Singleton {
    private DatabaseService $dbService;

    protected function __construct() {
        $this->dbService = DatabaseService::getInstance();
    }

    public function getBlogPost(string $permalink) {
        $dbService = $this->dbService;

        try {
            $dbService->connect();
            $dbService->selectFunction('select_blog_post', [ $permalink ]);
            $post = $dbService->nextRow();
        }
        catch(Exception $e) {
            $post['title'] = 'Error';
            $post['content'] = $e->getMessage();
        }
        $dbService->disconnect();

        return $post;
    }
}

?>