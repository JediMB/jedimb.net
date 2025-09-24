<?php declare(strict_types=1);

namespace Models;

class MenuItem {
    public string $title;
    public string $path;
    public array $children;

    public function __construct(string $title, string $path) {
        $this->title = $title;
        $this->path = $path;
        $this->children = [];
    }
}

?>