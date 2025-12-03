<?php declare(strict_types=1);

namespace Models\DB;

require_once 'models/base/db-base.model.php';

use Models\Base\DBBase;

class GalleryImage extends DBBase {
    public int $galleryId;
    public int $imageId;
    public int $order;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->galleryId = $dbRow['gallery_id'];
        $this->imageId = $dbRow['image_id'];
        $this->order = $dbRow['order'];
    }
}

?>