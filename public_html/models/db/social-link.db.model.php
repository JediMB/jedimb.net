<?php declare(strict_types=1);

namespace Models\DB;

class SocialLink {
    public int $id;
    public string $name;
    public string $description;
    public string $url;
    public string $svgViewBox;
    public string $svgContent;
    public int $order;
    public bool $isVisible;

    public function __construct(array $dbRow) {
        $this->id = $dbRow['id'] ?? 0;
        $this->name = $dbRow['name'] ?? '';
        $this->description = $dbRow['description'] ?? '';
        $this->url = $dbRow['url'] ?? '';
        $this->svgViewBox = $dbRow['svg_viewbox'] ?? '';
        $this->svgContent = $dbRow['svg_content'] ?? '';
        $this->order = $dbRow['order'] ?? 0;
        $this->isVisible = $dbRow['is_visible'] ?? false;
    }
}

?>