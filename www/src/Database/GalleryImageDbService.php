<?php declare(strict_types=1);

namespace Database;

use Exception;
use PDO;
use PDOException;
use Abstract\BaseDbService;
use Models\DB\GalleryImage;

class GalleryImageDbService extends BaseDbService {
    protected function __construct() {
        parent::__construct();
    }

    public function createGalleryImage(GalleryImage $galleryImage) {
        try {
            $result = $this->dbService->selectFunction(
                'create_gallery_image', [
                    1 => [ 'value' => $galleryImage->galleryId, 'type' => PDO::PARAM_INT ],
                    2 => [ 'value' => $galleryImage->imageId, 'type' => PDO::PARAM_INT ],
                    3 => [ 'value' => $galleryImage->order, 'type' => PDO::PARAM_INT ],
                ]
            );

            return new GalleryImage($result);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
    
    public function deleteGalleryImage(int $id) : GalleryImage|false {
        try {
            $deletedGalleryImage = $this->dbService->deleteById('gallery_image', $id);

            if ($deletedGalleryImage)
                return new GalleryImage($deletedGalleryImage);

            return false;
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    /** @return GalleryImage[] */
    public function getGalleryImages(?int $id = null, bool $isImageId = false) : array {
        try {
            $orderBy = [ [ 'name' => 'order' ] ];

            if ($id === null)
                $galleryImageData = $this->dbService->selectView('gallery_image', orderBy: $orderBy);
            else if (!$isImageId)
                $galleryImageData = $this->dbService->selectAllByColumnValue('gallery_image', 'gallery_id', $id, $orderBy);
            else
                $galleryImageData = $this->dbService->selectAllByColumnValue('gallery_image', 'image_id', $id, $orderBy);
            
            return array_map(fn($galleryImage) => new GalleryImage($galleryImage), $galleryImageData);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function updateGalleryImage(GalleryImage $object) : GalleryImage {
        try {
            $result = $this->dbService->selectFunction(
                'update_gallery_image', [
                    1 => [ 'value' => $object->id, 'type' => PDO::PARAM_INT ],
                    2 => [ 'value' => $object->order, 'type' => PDO::PARAM_INT ]
                ]
            );

            return new GalleryImage($result);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}