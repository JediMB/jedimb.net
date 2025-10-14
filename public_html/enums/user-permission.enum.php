<?php declare(strict_types=1);

namespace Enums;

enum UserPermission {
    case Configuration;
    case Publishing;
    case Editing;
    case Deleting;
}

?>