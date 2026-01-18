<?php declare(strict_types=1);

require_once 'models/dto/gallery-images.dto.model.php';
require_once 'services/image-gallery.service.php';
require_once 'utilities/response.utility.php';

use Enums\UserPermission;
use Models\DTO\Gallery;
use Models\DTO\GalleryImages;
use Services\ImageGalleryService;
use Services\SessionService;
use Utilities\Response;

$service = ImageGalleryService::getInstance(); /** @var ImageGalleryService $service */
$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */

if (isset($GLOBALS['api_params'][0]))
    $id = (int)($GLOBALS['api_params'][0]);

$input = json_decode(file_get_contents('php://input'), true);

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'DELETE':
        if ( ( $response = conditionChecks($input, [ UserPermission::Deleting ]) ) )
            return $response;

        try {
            if (empty($id))
                return Response::BadRequest('Galleries delete request missing id');

            $result = $service->deleteGallery($id);

            return Response::Success($result);
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    case 'GET':
        try {
            if (empty($id)) {
                $galleryData = $service->getGalleries();

                return Response::Success($galleryData);
            }

            $galleryData = $service->getGallery($id);

            return Response::Success($galleryData);
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    case 'PATCH':
        if ( ( $response = conditionChecks($input, [ UserPermission::Editing ]) ) )
            return $response;

        try {
            $galleryImagesDTO = new GalleryImages($input);

            $result = $service->updateGalleryImages($galleryImagesDTO);

            if ($result === true)
                return Response::Success(true);
            
            return Response::Error($result);
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    case 'POST':
        if ( ( $response = conditionChecks($input, [ UserPermission::Publishing ]) ) )
            return $response;

        try {
            // TODO: Gallery creation logic

            return Response::InvalidRequest();
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    case 'PUT':
        if ( ( $response = conditionChecks($input, [ UserPermission::Editing ]) ) )
            return $response;

        try {
            $galleryDTO = new Gallery($input);

            $result = $service->updateGallery($galleryDTO);

            return Response::Success($result);
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    default:
        return Response::InvalidRequest();
}

function conditionChecks(mixed $requestBody, array $permissions) {
    global $sessionService; /** @var SessionService $sessionService */
    
    if (!$sessionService->isLoggedIn())
        return Response::Forbidden(TEXT_NOT_LOGGED_IN);

    if (!$sessionService->hasPermissions($permissions))
        return Response::Forbidden(TEXT_INSUFFICIENT_PERMISSIONS);

    if (empty($requestBody))
        return Response::BadRequest('Request body is empty');
}

?>