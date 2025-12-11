<?php declare(strict_types=1);

namespace Services;

require_once 'models/dto/image.dto.model.php';
require_once 'services/table-modified.service.php';
require_once 'services/base/singleton.php';
require_once 'services/db/image-gallery.db.service.php';

use Models\DB\Gallery;
use Models\DB\Image;
use Models\DTO\Image as ImageDTO;
use Services\TableModifiedService;
use Services\Base\Singleton;
use Services\DB\ImageGalleryDBService;

class ImageGalleryService extends Singleton {
    private ImageGalleryDBService $imageGalleryDbService;
    private TableModifiedService $tableModifiedService;

    protected function __construct() {
        $this->imageGalleryDbService = ImageGalleryDBService::getInstance();
        $this->tableModifiedService = TableModifiedService::getInstance();
    }

    /** @return array{'object': \Models\DB\Image, 'modifiedOn': \DateTime} */
    public function createImage(ImageDTO $imageDTO) {
        return [
            'object' => $this->imageGalleryDbService->createImage($imageDTO),
            'modifiedOn' => $this->tableModifiedService->createOrUpdateTableModifiedDate('image')
        ];
    }

    public function getGalleries() : array {
        return $this->imageGalleryDbService->getGalleries();
    }

    public function getGallery(int $id) : Gallery {
        return $this->imageGalleryDbService->getGallery($id);
    }

    public function getImage(int $id) : Image {
        return $this->imageGalleryDbService->getImage($id);
    }

    public function getImages() : array {
        return $this->imageGalleryDbService->getImages();
    }

    /** @return array{'object': \Models\DB\Image, 'modifiedOn': \DateTime} */
    public function updateImage(ImageDTO $imageDTO) : array {
        $image = $this->imageGalleryDbService->getImage($imageDTO->id);
        ImageDTO::update($image, $imageDTO);

        $updatedImage = $this->imageGalleryDbService->updateImage($image);
        $modifiedOn = $this->tableModifiedService->createOrUpdateTableModifiedDate('image');

        return [
            'object' => $updatedImage,
            'modifiedOn' => $modifiedOn
        ];
    }
}

?>