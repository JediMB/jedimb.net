<?php declare(strict_types=1);

namespace Models;

class MenuItem {
    public string $title;
    public string $path;
    public ?string $description; 
    public array $children;

    public function __construct(string $title, string $path, ?string $description = null) {
        $this->title = $title;
        $this->path = $path;
        $this->description = $description;
        $this->children = [];
    }
}

?>