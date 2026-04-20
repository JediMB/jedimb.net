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

if ( isset($GLOBALS['api_params']) && ($paramCount = count($GLOBALS['api_params'])) ) {
    if (is_numeric($GLOBALS['api_params'][0])) {
        $id = (int)($GLOBALS['api_params'][0]);

        if ($paramCount === 2)
            $action = (string)($GLOBALS['api_params'][1]);
    }
}

$input = json_decode(file_get_contents('php://input'), true);

try {
    switch ( $_SERVER['REQUEST_METHOD'] ) {
        case 'DELETE':
            if (empty($id))
                return Response::BadRequest('No id in blog post DELETE request');

            if ( ($response = $sessionService->getInvalidSubmissionResponse($id, [ UserPermission::Deleting ])) )
                return $response;

            $post = $service->deleteBlogPost($id);

            if (!$post)
                return Response::Error(['Invalid blog post id, or blog post already deleted']);

            return Response::Success($post);


        case 'GET':
            if (empty($id))
                return Response::BadRequest('No id in blog post GET request');

            if ($sessionService->hasPermissions([ UserPermission::Editing ]))
                $post = $service->getBlogPost($id);
            else
                $post = $service->getPublicBlogPost($id);

            if (!$post)
                return Response::BadRequest('Invalid blog post id, or insufficient permissions');

            return Response::Success($post);

        case 'PATCH':
            $action ??= '';

            switch ($action) {
                case 'hide':
                    if ( ($response = $sessionService->getInvalidSubmissionResponse($id, [ UserPermission::Editing ])) )
                        return $response;

                    $success = $service->toggleHidden($id, true);

                    if (!$success)
                        return Response::Error(['Invalid blog post id']);

                    return Response::Success($success);

                case 'pin':
                    if ( ($response = $sessionService->getInvalidSubmissionResponse($id, [ UserPermission::Editing ])) )
                        return $response;

                    $success = $service->togglePinned($id, true);

                    if (!$success)
                        return Response::Error(['Invalid blog post id']);

                    return Response::Success($success);

                case 'unhide':
                    if ( ($response = $sessionService->getInvalidSubmissionResponse($id, [ UserPermission::Editing ])) )
                        return $response;

                    $success = $service->toggleHidden($id, false);

                    if (!$success)
                        return Response::Error(['Invalid blog post id']);

                    return Response::Success($success);

                case 'unpin':
                    if ( ($response = $sessionService->getInvalidSubmissionResponse($id, [ UserPermission::Editing ])) )
                        return $response;

                    $success = $service->togglePinned($id, false);

                    if (!$success)
                        return Response::Error(['Invalid blog post id']);

                    return Response::Success($success);
                
                default:
                    return Response::BadRequest('Malformed patch request');
                    
            }

        case 'POST':
            if ( ($response = $sessionService->getInvalidSubmissionResponse($input, [ UserPermission::Publishing ])) )
                return $response;

            $post = new BlogPostDTO($input);
            $userId = $sessionService->getUser()->id;

            if (empty($post->scheduledOn)) {
                $post = $service->publishBlogPost($post, $userId)['blogPost'];

                return Response::Created($post);
            }

            if (!DateTime::parse($post->scheduledOn))
                return Response::BadRequest('Invalid publishing date format');

            $schedule = $service->scheduleBlogPost($post, $userId);
            
            return Response::Created($schedule);
            
        case 'PUT':
            if ( ($response = $sessionService->getInvalidSubmissionResponse($input, [ UserPermission::Editing ])) )
                return $response;

            $postDTO = new BlogPostDTO($input);

            $updatedPost = $service->updateBlogPost($postDTO);

            if (!$updatedPost)
                return Response::Error(["Failed to update blog post with id {$postDTO->id}"]);

            return Response::Success($updatedPost);


        default:
            return Response::InvalidRequest();
    }
}
catch (InputException $e) {
    return Response::InputException($e->getErrors());
}
catch (Exception $e) {
    return Response::Error([$e->getMessage()]);
}

?>