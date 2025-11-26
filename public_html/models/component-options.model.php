<?php declare(strict_types=1);

namespace Models;

class ComponentOptions {
    public bool $hidden = false;
    public bool $componentTag = true;
    public bool $renderOnce = false;
    public bool $includeCSS = false;
    public bool $includeJSModule = false;
}

?>