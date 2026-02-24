<?php declare(strict_types=1);

require_once 'models/dto/blog-post.dto.model.php';
require_once 'services/blog-post.service.php';
require_once 'utilities/response.utility.php';

use Enums\UserPermission;
use Models\DTO\BlogPost as BlogPostDTO;
use Models\Exceptions\InputException;
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

            if ($sessionService->hasPermissions([ UserPermission::Editing ]))
                $post = $service->getBlogPost($id);
            else
                $post = $service->getPublishedBlogPost($id);

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

            if (empty($post->scheduledOn)) {
                $response = $service->publishBlogPost($post);

                return Response::Success($response);
            }

            $response = $service->scheduleBlogPost($post);
            
            return Response::Success([
                'modifiedOn' => 'test',
                'blogPost' => $post
            ]);
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