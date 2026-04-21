<?php declare(strict_types=1);

require_once 'models/dto/image.dto.model.php';
require_once 'services/image-gallery.service.php';
require_once 'utilities/response.utility.php';

use Enums\UserPermission;
use Models\DTO\Image;
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
        if ( ( $response = conditionChecks($id, [ UserPermission::Deleting ]) ) )
            return $response;
        
        try {
            if (empty($id))
                return Response::BadRequest('Images delete request missing id');

            $result = $service->deleteImage($id);

            return Response::Success($result);
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    case 'GET':
        try {
            if (empty($id)) {
                $imageData = $service->getImages();

                return Response::Success($imageData);
            }

            $imageData = $service->getImage($id);

            return Response::Success($imageData);
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    case 'PATCH':
        if ( ( $response = conditionChecks($input, [ UserPermission::Editing ]) ) )
            return $response;
        
        try {
            $imageDTO = new Image($input);

            $result = $service->updateImage($imageDTO);

            return Response::Success($result);
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    case 'POST':
        if ( ( $response = conditionChecks($input, [ UserPermission::Publishing ]) ) )
            return $response;

        if (empty($input['dto']) || empty($input['file']))
            return Response::BadRequest(TEXT_MALFORMED_REQUEST);

        if (strlen($input['file']) > UPLOAD_IMAGE_SIZE_LIMIT)
            return Response::BadRequest(TEXT_IMAGE_SIZE_LIMIT);

        try {
            $result = $service->createImage(new Image($input['dto']), $input['file']);
            
            if (isset($result['badrequest']))
                return Response::BadRequest($result['message']);

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