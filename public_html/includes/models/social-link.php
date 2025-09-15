<?php

namespace Models;

class SocialLink {
    public int $id;
    public string $name;
    public string $description;
    public string $url;
    public string $svgViewBox;
    public string $svgContent;

    public function __construct(array $dbRow) {
        $this->id = $dbRow['id'] ?? -1;
        $this->name = $dbRow['name'] ?? '';
        $this->description = $dbRow['description'] ?? '';
        $this->url = $dbRow['url'] ?? '';
        $this->svgViewBox = $dbRow['svg_viewbox'] ?? '';
        $this->svgContent = $dbRow['svg_content'] ?? '';
    }
}

?>