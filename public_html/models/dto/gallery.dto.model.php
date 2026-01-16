<?php declare(strict_types=1);

namespace Models\DTO;

require_once 'models/base/db-base.model.php';

use InvalidArgumentException;
use Models\Base\DBBase;

class Gallery extends DBBase {
    public string $title;
    public string $description;

    public function __construct(array $input) {
        parent::__construct($input);

        $this->title = trim($input['title']);
        $this->description = trim($input['description']);
    }

    public static function update(\Models\DB\Gallery &$object, Gallery $source) {
        if ($object->id !== $source->id)
            throw new InvalidArgumentException('Incorrect Gallery id in update call');

        $object->title = $source->title;
        $object->description = $source->description;
    }
}

?>
