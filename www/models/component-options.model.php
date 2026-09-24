<?php declare(strict_types=1);

namespace Models;

class ComponentOptions {
    public array $attributes = [];
    public bool $componentTag = true;
    public bool $hidden = false;
    public bool $includeCSS = false;
    public bool $includeJSModule = false;
    public bool $renderOnce = false;
}

?>