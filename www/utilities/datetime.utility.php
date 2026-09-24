<?php declare(strict_types=1);

namespace Utilities;

class DateTime {
    static function parse(?string $string) : \DateTime | null {
        if (empty($string))
            return null;

        return \DateTime::createFromFormat(DB_DATETIME_FORMAT, $string)
            ?: \DateTime::createFromFormat(DB_DATETIME_FORMAT_FALLBACK, $string);
    }

    static function toPermadateString(?\DateTime $dateTime) : string {
        return date('/Y/m/d/', $dateTime?->getTimestamp());
    }

    static function toPrecisionString(?\DateTime $dateTime) : string {
        if (empty($dateTime))
            return '';

        return $dateTime->format('Y-m-d H:i:s.v O');
    }

    static function toString(?\DateTime $dateTime) : string {
        if (empty($dateTime))
            return '';

        return $dateTime->format('Y-m-d H:i:s O');
    }
}

?>