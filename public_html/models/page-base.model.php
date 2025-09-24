<?php declare(strict_types=1);

namespace Models;

class PageBase {
    public string $title;
    public string $content;

    public function __construct(array $dbRow)
    {
        $this->title = $dbRow['title'] ?? '';
        $this->content = $dbRow['content'] ?? '';
    }
}

?>