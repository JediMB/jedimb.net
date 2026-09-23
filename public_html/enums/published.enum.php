<?php declare(strict_types=1);

namespace Enums;

enum Published : int {
    case Unpublished = 0;
    case Published = 1;
    case Any = 2;
}

?>