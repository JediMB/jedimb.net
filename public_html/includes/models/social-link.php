<?php

class SocialLink {
    public int $id;
    public string $name;
    public string $description;
    public string $url;
    public string $svgViewBox;
    public string $svgContent;

    public function __construct(array $dbRow) {
        try {
            $this->id = $dbRow['id'];
            $this->name = $dbRow['name'];
            $this->description = $dbRow['description'];
            $this->url = $dbRow['url'];
            $this->svgViewBox = $dbRow['svg_viewbox'];
            $this->svgContent = $dbRow['svg_content'];
        }
        catch (Exception $e) {
            echo 'Error converting database row to SocialLink object: ' . $e->getMessage();
        }
    }
}

?>