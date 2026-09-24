<?php declare(strict_types=1);

namespace Enums;

enum Visibility : int {
    case Hidden = 0;
    case Visible = 1;
    case Any = 2;
}

?>