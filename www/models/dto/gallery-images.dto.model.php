<?php declare(strict_types=1);

namespace Models\DTO;

require_once 'models/base/db-base.model.php';

use Models\Base\DBBase;

class GalleryImages {
    public int $galleryId;
    /** @var int[] */
    public array $imageIds;

    public function __construct(array $input) {
        $this->galleryId = $input['galleryId'];

        $this->imageIds = [];
        foreach ($input['imageIds'] as $id) {
            $this->imageIds[] = (int)$id;
        }
    }
}

?>
