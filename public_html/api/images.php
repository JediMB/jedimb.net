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
        conditionChecks([ UserPermission::Deleting ]);
        
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
        conditionChecks([ UserPermission::Editing ]);
        
        try {
            $imageDTO = new Image($input);

            $result = $service->updateImage($imageDTO);

            return Response::Success($result);
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    case 'POST':
        conditionChecks([ UserPermission::Publishing ]);

        try {
            if (empty($input['dto']) || empty($input['file']))
                return Response::BadRequest(TEXT_MALFORMED_REQUEST);

            if (strlen($input['file']) > UPLOAD_IMAGE_SIZE_LIMIT)
                return Response::BadRequest(TEXT_IMAGE_SIZE_LIMIT);

            $basename = date('Ymd_His_') . str_pad(dechex(rand(0x0000, 0xFFFF)), 4, '0', STR_PAD_LEFT);
            $filepath = PATH_TEMP_DIR . '/' . $basename;

            if (!realpath(PATH_TEMP_DIR))
                mkdir(PATH_TEMP_DIR, 0777, true);

            if ( !($file = fopen($filepath, 'wb')) )
                return Response::Error([TEXT_IMAGE_COULD_NOT_BE_CREATED]);

            stream_filter_append($file, 'convert.base64-decode');
            fwrite($file, $input['file']);
            fclose($file);

            $mime = mime_content_type($filepath);

            if (empty(UPLOAD_IMAGE_MIME_TYPES[$mime])) {
                unlink($filepath);
                return Response::BadRequest(TEXT_IMAGE_DISALLOWED_TYPE . $mime);
            }

            $finalName = "$basename." . UPLOAD_IMAGE_MIME_TYPES[$mime];
            $input['dto']['filename'] = $finalName;
            
            $result = $service->createImage(new Image($input['dto']));

            if (!realpath(PATH_IMAGE_GALLERY))
                mkdir(PATH_IMAGE_GALLERY, 0777, true);

            rename($filepath, PATH_IMAGE_GALLERY . "/$finalName");

            return Response::Success($result);
        }
        catch (Exception $e) {
            if ( isset($filepath) && ($realpath = realpath($filepath)) )
                unlink($realpath);

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