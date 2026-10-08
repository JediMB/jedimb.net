<?php declare(strict_types=1);

namespace App\Abstract;

use function pathFromClass;

abstract class Component {
    private string $template;

    public function __construct() {
        $this->template = pathFromClass(static::class, "_template");

        $this->render();
    }

    public function render() {
        $data = $this;

        include $this->template;
    }
}