<?php declare(strict_types=1);

namespace API\Blog;

require_once 'models/dto/blog-post.dto.model.php';
require_once 'services/blog-post.service.php';
require_once 'utilities/response.utility.php';

use Exception;
use Enums\UserPermission;
use Models\DTO\BlogPost as BlogPostDTO;
use Models\Exceptions\InputException;
use Services\BlogPostService;
use Services\SessionService;
use Utilities\DateTime;
use Utilities\Response;

$service = BlogPostService::getInstance(); /** @var BlogPostService $service */
$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */

if (isset($GLOBALS['api_params'][0]) && is_numeric($GLOBALS['api_params'][0]))
    $id = (int)($GLOBALS['api_params'][0]);

$input = json_decode(file_get_contents('php://input'), true);

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'GET':
        try {
            if (empty($id))
                return Response::BadRequest('No id in blog post request');

            if ($sessionService->hasPermissions([ UserPermission::Editing ]))
                $post = $service->getBlogPost($id);
            else
                $post = $service->getPublicBlogPost($id);

            if (!$post)
                return Response::BadRequest('Invalid blog post id, or insufficient permissions');

            return Response::Success($post);
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    case 'POST':
        try {
            if ( ($response = $sessionService->getInvalidSubmissionResponse($input, [ UserPermission::Publishing ])) )
                return $response;

            $post = new BlogPostDTO($input);
            $userId = $sessionService->getUser()->id;

            if (empty($post->scheduledOn)) {
                $post = $service->publishBlogPost($post, $userId)['blogPost'];

                return Response::Success($post);
            }

            if (!DateTime::parse($post->scheduledOn))
                return Response::BadRequest('Invalid publishing date format');

            $schedule = $service->scheduleBlogPost($post, $userId);
            
            return Response::Success($schedule);
        }
        catch (InputException $e) {
            return Response::InputException($e->getErrors());
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    default:
        return Response::InvalidRequest();
}

?>