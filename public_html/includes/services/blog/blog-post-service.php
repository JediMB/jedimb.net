<?php

require_once 'includes/services/database-service.php';

class BlogPostService {
    private static BlogPostService $instance;
    private DatabaseService $dbService;

    private function __construct() {
        $this->dbService = DatabaseService::getInstance();
    }
    private function __clone() { }
    public function __wakeup() {
        throw new Exception('Cannot unserialize a singleton.');
    }

    public static function getInstance() {
        if (isset(self::$instance))
            return self::$instance;

        return (self::$instance = new BlogPostService());
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