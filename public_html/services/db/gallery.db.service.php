<?php declare(strict_types=1);

namespace Services\DB;

require_once 'models/db/gallery.db.model.php';
require_once 'models/dto/gallery.dto.model.php';
require_once 'services/base/base.db.service.php';

use Exception;
use PDO;
use PDOException;
use Models\DB\Gallery;
use Models\DTO\Gallery as GalleryDTO;
use Services\Base\BaseDBService;

class GalleryDBService extends BaseDBService {
    protected function __construct() {
        parent::__construct();
    }

    public function createGallery(GalleryDTO $object) : Gallery {
        try {
            $result = $this->dbService->selectFunction(
                'create_gallery', [
                    1 => [ 'value' => $object->title, 'type' => PDO::PARAM_STR ],
                    2 => [ 'value' => $object->description, 'type' => PDO::PARAM_STR ]
                ]
            );

            return new Gallery($result);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function deleteGallery(int $id) : Gallery|false {
        try {
            $deletedGallery = $this->dbService->deleteById('gallery', $id);

            if ($deletedGallery)
                return new Gallery($deletedGallery);

            return false;
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    /** @return Gallery[] */
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

    public function getGallery(int $id) : Gallery {
        try {
            $gallery = $this->dbService->selectById('gallery', $id);

            if (!$gallery)
                throw new Exception('Invalid gallery ID');

            return new Gallery($gallery);

        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function updateGallery(Gallery $object) : Gallery {
        try {
            $result = $this->dbService->selectFunction(
                'update_gallery', [
                    1 => [ 'value' => $object->id, 'type' => PDO::PARAM_INT ],
                    2 => [ 'value' => $object->title, 'type' => PDO::PARAM_STR ],
                    3 => [ 'value' => $object->description, 'type' => PDO::PARAM_STR ]
                ]
            );

            return new Gallery($result);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}

?>