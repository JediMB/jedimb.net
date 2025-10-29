<?php declare(strict_types=1);

namespace Enums;

enum UserRole : int {
    case User = 0;
    case Administrator = 1;
    case Contributor = 2;
}

?>