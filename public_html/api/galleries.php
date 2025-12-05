<?php declare(strict_types=1);

require_once 'services/image-gallery.service.php';
require_once 'utilities/response.utility.php';

use Services\ImageGalleryService;
use Utilities\Response;

$service = ImageGalleryService::getInstance(); /** @var ImageGalleryService $service */

if (isset($GLOBALS['api_params'][0]))
    $id = (int)($GLOBALS['api_params'][0]);

switch ( $_SERVER['REQUEST_METHOD'] ) {
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

    default:
        return Response::InvalidRequest();
}

?>