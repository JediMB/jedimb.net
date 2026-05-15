<?php declare(strict_types=1);

require_once 'enums/published.enum.php';
require_once 'enums/visibility.enum.php';
require_once 'services/blog-post.service.php';
require_once 'utilities/response.utility.php';

use Enums\Published;
use Enums\UserPermission;
use Enums\Visibility;
use Services\BlogPostService;
use Services\SessionService;
use Utilities\Response;

$service = BlogPostService::getInstance(); /** @var BlogPostService $service */
$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */

$apiParams = $GLOBALS['api_params'];

$page = isset($apiParams[0]) && is_numeric($apiParams[0]) ? (int)$apiParams[0] : 1;
$pageSize = isset($apiParams[1]) && is_numeric($apiParams[1]) ? (int)$apiParams[1] : null;

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'GET':
        try {
            $adminKey = array_find_key($apiParams, fn($value) => $value === 'admin');

            if (!is_int($adminKey) || !$sessionService->hasPermissions([ UserPermission::Configuration ])) {
                $result = $service->getPublicBlogPosts($page, $pageSize);

                return Response::Success($result);
            }

            $adminParams = array_slice($apiParams, $adminKey);

            $publishedKey = array_find_key($adminParams, fn($value) => $value === 'published');
            $visibilityKey = array_find_key($adminParams, fn($value) => $value === 'visibility');

            $published = Published::Any;

            if (is_int($publishedKey) && isset($adminParams[$publishedKey + 1])) {
                $published = Published::tryFrom((int)($adminParams[$publishedKey + 1]))
                    ?? Published::Published;
            }

            $visibility = Visibility::Any;

            if (is_int($visibilityKey) && isset($adminParams[$visibilityKey + 1])) {
                $visibility = Visibility::tryFrom((int)($adminParams[$visibilityKey + 1]))
                    ?? Visibility::Visible;
            }

            $result = $service->getBlogPostsAdminData($page, $pageSize, $published, $visibility);

            return Response::Success($result);
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    default:
        return Response::InvalidRequest();
}

?>