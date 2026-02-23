<?php declare(strict_types=1);

namespace Enums;

enum InputError : string {
    case Required = 'required';
    case TooShort = 'too-short';
    case TooLong = 'too-long';
    case Mismatch = 'mismatch';
}

?>