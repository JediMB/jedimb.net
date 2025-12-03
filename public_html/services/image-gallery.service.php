<?php declare(strict_types=1);

namespace Services;

require_once 'services/base/singleton.php';
require_once 'services/db/image-gallery.db.service.php';

use Services\Base\Singleton;
use Services\DB\ImageGalleryDBService;

class ImageGalleryService extends Singleton {
    private ImageGalleryDBService $imageGalleryDbService;

    protected function __construct() {
        $this->imageGalleryDbService = ImageGalleryDBService::getInstance();
    }

    public function getImages() : array {
        return $this->imageGalleryDbService->getImages();
    }
}

?>