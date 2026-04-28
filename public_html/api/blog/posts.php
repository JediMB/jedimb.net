<?php declare(strict_types=1);

require_once 'enums/blog-post-status.enum.php';
require_once 'enums/published-status.enum.php';
require_once 'enums/visibility.enum.php';
require_once 'services/blog-post.service.php';
require_once 'utilities/response.utility.php';

use Enums\BlogPostStatus;
use Enums\PublishedStatus;
use Enums\UserPermission;
use Enums\Visibility;
use Services\BlogPostService;
use Services\SessionService;
use Utilities\Response;

$service = BlogPostService::getInstance(); /** @var BlogPostService $service */
$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */

$apiParams = $GLOBALS['api_params'];
//$paramCount = count($apiParams);
$page = isset($apiParams[0]) && is_numeric($apiParams[0]) ? (int)$apiParams[0] : 1;
$pageSize = isset($apiParams[1]) && is_numeric($apiParams[1]) ? (int)$apiParams[1] : null;

$adminKey = array_find_key($apiParams, fn($value) => $value === 'admin');

$input = json_decode(file_get_contents('php://input'), true);

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'GET':
        try {
            if (!is_int($adminKey) || !$sessionService->hasPermissions([ UserPermission::Configuration ])) {
                $result = $service->getPublicBlogPosts($page, $pageSize);

                return Response::Success($result);
            }

            $adminParams = array_slice($apiParams, $adminKey);

            $publishedStatus = PublishedStatus::Published;

            if (in_array(BlogPostStatus::Unpublished->value, $adminParams))
                $publishedStatus = PublishedStatus::Unpublished;

            if (in_array(BlogPostStatus::Published->value, $adminParams))
                $publishedStatus = ($publishedStatus === PublishedStatus::Unpublished)
                    ? PublishedStatus::Any
                    : PublishedStatus::Published;

            $visibility = Visibility::Visible;

            if (in_array(BlogPostStatus::Hidden->value, $adminParams))
                $visibility = Visibility::Hidden;
            
            if (in_array(BlogPostStatus::Visible->value, $adminParams))
                $visibility = ($visibility === Visibility::Hidden)
                    ? Visibility::Any
                    : Visibility::Visible;

            $result = $service->getBlogPostsAdminData($page, $pageSize, $publishedStatus, $visibility);

            return Response::Success($result);
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    default:
        return Response::InvalidRequest();
}

?>