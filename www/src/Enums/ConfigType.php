<?php declare(strict_types=1);

namespace App\Enums;

enum ConfigType : string {
    case Number = 'number';
    case Text = 'text';
    case CSV = 'csv';
}