<?php declare(strict_types=1);

namespace App\Abstract;

use function pathFromClass;

abstract class Component {
    public readonly string $uid;
    private readonly string $template;
    private readonly string $body;

    protected function __construct() {
        $this->uid = uniqid();
        $this->template = pathFromClass(static::class, "_template");

        $data = $this;
        ob_start();
        include $this->template;
        $this->body = ob_get_clean();
    }

    public function render() {
        echo $this->body;
    }

    public function __toString() {
        return $this->body;
    }
}