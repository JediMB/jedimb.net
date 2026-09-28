<?php declare(strict_types=1);

function pathFromClass(string $class, string $preExtensionSuffix = '') : string {
    $matches = [];

    if (!preg_match('/^([\w\d]+)\\\\([\w\d\\\\]+)$/', $class, $matches))
        throw new Exception("Invalid class name ($matches[2]) or namespace ($matches[1]) in autoloader: $class");

    $subPath = str_replace("\\", "/", $matches[2]) . $preExtensionSuffix . '.php';

    return match ($matches[1]) {
        "App" => "../src/",
        default => throw new Exception("Unknown first-level namespace in autoloader: $matches[1]")
    } . $subPath;
}