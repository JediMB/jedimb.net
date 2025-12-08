<?php declare(strict_types=1);

namespace Models\DTO;

use InvalidArgumentException;

require_once 'models/db/image.db.model.php';

class Image {
    public int $id;
    public ?string $filename;
    public string $title;
    public string $description;

    public function __construct(array $input) {
        $this->id = $input['id'];
        $this->filename = isset($input['filename']) ? trim($input['filename']) : null;
        $this->title = trim($input['title']);
        $this->description = trim($input['description']);
    }

    public static function update(\Models\DB\Image &$object, Image $source) {
        if ($object->id !== $source->id)
            throw new InvalidArgumentException('Incorrect Image id in update call');

        $object->title = $source->title;
        $object->description = $source->description;
    }
}

?>