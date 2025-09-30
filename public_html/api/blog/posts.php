<?php declare(strict_types=1);

require_once 'services/blog-post.service.php';

use Services\BlogPostService;

$input = json_decode(file_get_contents('php://input'), true);

// $params = $GLOBALS['api_params'];

switch( $_SERVER['REQUEST_METHOD'] ) {
    case 'GET':
        try {
            $service = BlogPostService::getInstance();
            /** @var BlogPostService $service */

            $posts = $service->getBlogPosts();
            
            return [ 'success' => true, 'value' => $posts ];
        }
        catch (PDOException $e) {
            return [ 'success' => false, 'errors' => [ $e->getMessage()] ];
        }

    default:
        return [ 'success' => false, 'errors' => [ TEXT_INVALID_REQUEST ] ];
}

?>