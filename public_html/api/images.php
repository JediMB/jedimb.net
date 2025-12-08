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
        conditionChecks([ UserPermission::Editing ]);
        
        try {
            $imageDTO = new Image($input);

            $result = $service->updateImage($imageDTO);

            return Response::Success($result);
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    default:
        return Response::InvalidRequest();
}

function conditionChecks(array $permissions) {
    global $sessionService, $input; /** @var SessionService $sessionService */
    
    if (!$sessionService->isLoggedIn())
        return Response::Forbidden(TEXT_NOT_LOGGED_IN);

    if (!$sessionService->hasPermissions($permissions))
        return Response::Forbidden(TEXT_INSUFFICIENT_PERMISSIONS);

    if (empty($input))
        return Response::BadRequest('Request body is empty');
}

?>