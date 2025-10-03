<?php declare(strict_types=1);

require_once 'services/db/blog-post.db.service.php';

use Services\DB\BlogPostDBService;

$input = json_decode(file_get_contents('php://input'), true);

// $params = $GLOBALS['api_params'];

switch( $_SERVER['REQUEST_METHOD'] ) {
    case 'GET':
        try {
            $service = BlogPostDBService::getInstance(); /** @var BlogPostDBService $service */

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