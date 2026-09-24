<?php declare(strict_types=1);

namespace Models\DTO;

use InvalidArgumentException;
use Abstract\DbBase;

class ImageDTO extends DbBase {
    public ?string $filename;
    public string $title;
    public string $description;

    public function __construct(array $input) {
        parent::__construct($input);

        $this->filename = isset($input['filename']) ? trim($input['filename']) : null;
        $this->title = trim($input['title']);
        $this->description = trim($input['description']);
    }

    public static function update(\Models\DB\Image &$object, ImageDTO $source) {
        if ($object->id !== $source->id)
            throw new InvalidArgumentException('Incorrect Image id in update call');

        $object->title = $source->title;
        $object->description = $source->description;
    }
}