<?php declare(strict_types=1);

require_once 'services/blog-post.service.php';
require_once 'utilities/response.utility.php';

use Services\BlogPostService;
use Services\SessionService;
use Utilities\Response;

$service = BlogPostService::getInstance(); /** @var BlogPostService $service */
$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */

if (isset($GLOBALS['api_params'][0]))
    $id = (int)($GLOBALS['api_params'][0]);

$input = json_decode(file_get_contents('php://input'), true);

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'GET':
        try {
            if (empty($id)) {
                $posts = $service->getPublishedBlogPosts();
                return Response::Success($posts);
            }

            return Response::InvalidRequest();
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    default:
        return Response::InvalidRequest();
}

?>