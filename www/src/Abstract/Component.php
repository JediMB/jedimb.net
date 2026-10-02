<?php declare(strict_types=1);

namespace App\Abstract;

use function pathFromClass;

abstract class Component {
    private string $template;

    public function __construct() {
        $template = pathFromClass(static::class, "_template");
        $this->template = preg_replace('/\/[^\/]+$/', "/templates$0", $template);

        $this->render();
    }

    public function render() {
        $data = $this;

        include $this->template;
    }
}