<?php declare(strict_types=1);

namespace Enums;

enum InputError : string {
    case Required = 'required';
    case TooShort = 'tooShort';
    case TooLong = 'tooLong';
    case Mismatch = 'mismatch';
}

?>