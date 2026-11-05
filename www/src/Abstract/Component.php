<?php declare(strict_types=1);

namespace App\Abstract;

use function pathFromClass;

abstract class Component {
    public readonly string $uid;
    private readonly string $template;
    private readonly string $body;

    public static string $baseClass = '';

    protected function __construct() {
        $this->template = pathFromClass(static::class, "_template");
        $this->uid = uniqid();

        $baseClass = static::$baseClass;
        $baseId = "$baseClass-{$this->uid}";
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