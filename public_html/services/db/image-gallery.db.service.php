<?php declare(strict_types=1);

namespace Services\DB;

require_once 'models/db/image.db.model.php';
require_once 'services/base/base.db.service.php';

use Exception;
use Models\DB\Gallery;
use Models\DB\GalleryImage;
use Models\DB\Image;
use PDOException;
use Services\Base\BaseDBService;

class ImageGalleryDBService extends BaseDBService {
    protected function __construct() {
        parent::__construct();
    }

    public function getImages() : array {
        try {
            $images = $this->dbService->selectView('images_plus_gallery_ids');

            $galleryIds = [];
            $groupedImages = [];
            foreach ($images as $image) {
                $groupedImages[$image['id']] = $image;

                if ($image['gallery_id'])
                    $galleryIds[$image['id']][] = $image['gallery_id'];
            }

            $groupedImages = array_map(function($image) {
                return new Image($image);
            }, $groupedImages);

            foreach ($galleryIds as $key => $ids) {
                $groupedImages[$key]->galleryIds = $ids;
            }

            return $groupedImages;
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function getGalleries() : array {
        try {
            $galleries = $this->dbService->selectView('gallery');

            return array_map(function($gallery) {
                return new Gallery($gallery);
            }, $galleries);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function getGalleryImageData() : array {
        try {
            $galleryImageData = $this->dbService->selectView('gallery_image');

            return array_map(function($galleryImage) {
                return new GalleryImage($galleryImage);
            }, $galleryImageData);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}

?>