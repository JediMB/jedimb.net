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
use Utilities\Response;

$input = json_decode(file_get_contents('php://input'), true);

$sessionService = SessionService::getInstance();

if ( ($response = $sessionService->getInvalidSubmissionResponse($input, [ UserPermission::Editing ])) )
    return $response;

if (isset($GLOBALS['api_params'][0]) && is_string($GLOBALS['api_params'][0]))
    $action = $GLOBALS['api_params'][0];

$userId = $sessionService->getUser()->id;

$service = BlogPostService::getInstance();

try {
    switch ( $_SERVER['REQUEST_METHOD'] ) {
        case 'POST':
            $draftDTO = new BlogPostDTO($input);

            $post = $service->createDraft($draftDTO, $userId);

            return Response::Success($post);

        case 'PUT':
            $draftDTO = new BlogPostDTO($input);

            if (!isset($action)) {
                $post = $service->updateDraft($draftDTO, $userId);

                return Response::Success($post);
            }

            switch ($action) {
                case 'publish':
                    if ( ($response = $sessionService->getInvalidSubmissionResponse($input, [ UserPermission::Publishing ])) )
                        return $response;

                    $post = $service->updateAndPublishDraft($draftDTO, $userId);

                    if (!$post)
                        return Response::Error(["Failed to publish draft with id {$draftDTO->id}"]);

                    return Response::Success($post);

                case 'schedule':
                    if ( ($response = $sessionService->getInvalidSubmissionResponse($input, [ UserPermission::Publishing ])) )
                        return $response;

                    $schedule = $service->updateAndScheduleDraft($draftDTO, $userId);

                    if (!$schedule)
                        return Response::Error(["Failed to schedule draft with id {$draftDTO->id}"]);

                    return Response::Success($schedule);

                default:
                    return Response::InvalidRequest();
            }


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