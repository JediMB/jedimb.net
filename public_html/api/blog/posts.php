<?php declare(strict_types=1);

require_once 'services/blog-post.service.php';
require_once 'utilities/response.utility.php';

use Enums\UserPermission;
use Services\BlogPostService;
use Services\SessionService;
use Utilities\Response;

$service = BlogPostService::getInstance(); /** @var BlogPostService $service */
$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */

$apiParams = $GLOBALS['api_params'];
//$paramCount = count($apiParams);
$page = isset($apiParams[0]) && is_numeric($apiParams[0]) ? (int)$apiParams[0] : 1;
$pageSize = isset($apiParams[1]) && is_numeric($apiParams[1]) ? (int)$apiParams[1] : null;

$input = json_decode(file_get_contents('php://input'), true);

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'GET':
        try {
            $result = $service->getPublicBlogPosts($page, $pageSize);

            return Response::Success($result);
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    default:
        return Response::InvalidRequest();
}

?>