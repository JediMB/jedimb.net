<?php declare(strict_types=1);

namespace App\Models\App;

use App\Abstract\Component;

class TabbedContent {
    public readonly string $title;
    public readonly string $id;
    public readonly string $content;
    public bool $active;

    public function __construct(string $title, string $id, string|Component $content, bool $active = false) {
        $this->title = $title;
        $this->id = $id;

        $this->content = (string)$content;

        $this->active = $active;
    }
}
