<?php declare(strict_types=1);

namespace App\Enums;

enum UserPermission {
    case Configuration;
    case Publishing;
    case Editing;
    case Deleting;
}