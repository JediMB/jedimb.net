<?php declare(strict_types=1);

namespace Database;

require_once 'models/db/image.db.model.php';

use Exception;
use PDO;
use PDOException;
use Abstract\BaseDbService;
use Models\DB\Image;
use Models\DTO\Image as ImageDTO;

class ImageDbService extends BaseDbService {
    protected function __construct() {
        parent::__construct();
    }

    public function createImage(ImageDTO $object) : Image {
        try {
            $result = $this->dbService->selectFunction(
                'create_image', [
                    1 => [ 'value' => $object->filename, 'type' => PDO::PARAM_STR ],
                    2 => [ 'value' => $object->title, 'type' => PDO::PARAM_STR ],
                    3 => [ 'value' => $object->description, 'type' => PDO::PARAM_STR ]
                ]
            );

            return new Image($result);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function deleteImage(int $id) : Image|false {
        try {
            $deletedImage = $this->dbService->deleteById('image', $id);

            if ($deletedImage)
                return new Image($deletedImage);

            return false;
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function getImage(int $id) : Image {
        try {
            $image = $this->dbService->selectById('image', $id);

            if (!$image)
                throw new Exception('Invalid image ID');

            return new Image($image);

        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    /** @return Image[] */
    public function getImages() : array {
        try {
            $images = $this->dbService->selectView('image', orderBy: [ [ 'name' => 'id' ] ]);

            if (!$images)
                return [];

            return array_map(fn($image) => new Image($image), $images);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    public function updateImage(Image $object) : Image {
        try {
            $result = $this->dbService->selectFunction(
                'update_image', [
                    1 => [ 'value' => $object->id, 'type' => PDO::PARAM_INT ],
                    2 => [ 'value' => $object->title, 'type' => PDO::PARAM_STR ],
                    3 => [ 'value' => $object->description, 'type' => PDO::PARAM_STR ]
                ]
            );

            return new Image($result);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}