<?php declare(strict_types=1);

namespace Models\DB;

require_once 'models/base/db-base.model.php';

use Models\Base\DBBase;

class SocialLink extends DBBase {
    public string $name;
    public string $description;
    public string $url;
    public string $svgViewBox;
    public string $svgContent;
    public int $order;
    public bool $isHidden;

    public function __construct(array $dbRow) {
        parent::__construct($dbRow);

        $this->name = $dbRow['name'];
        $this->description = $dbRow['description'];
        $this->url = $dbRow['url'];
        $this->svgViewBox = $dbRow['svg_viewbox'];
        $this->svgContent = $dbRow['svg_content'];
        $this->order = $dbRow['order'];
        $this->isHidden = $dbRow['is_hidden'];
    }
}

?>