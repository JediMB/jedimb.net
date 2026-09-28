<?php declare(strict_types=1);

namespace App\Models\DTO;

use InvalidArgumentException;
use App\Abstract\DbBase;
use App\Models\DB\Gallery;

class GalleryDTO extends DbBase {
    public string $title;
    public string $description;

    public function __construct(array $input) {
        parent::__construct($input);

        $this->title = trim($input['title']);
        $this->description = trim($input['description']);
    }

    public static function update(Gallery &$object, GalleryDTO $source) {
        if ($object->id !== $source->id)
            throw new InvalidArgumentException('Incorrect Gallery id in update call');

        $object->title = $source->title;
        $object->description = $source->description;
    }
}