<?php declare(strict_types=1);

namespace App\Components;

use DateTime;
use InvalidArgumentException;
use App\Abstract\Component;

class CopyrightComponent extends Component {
    public readonly string $years;
    public readonly string $author;
    
    public function __construct(string $siteAuthor, DateTime|string $dateSource) {
        if (is_string($dateSource)) {
            if (!($realpath = realpath($dateSource)) || !is_file($realpath))
                throw new InvalidArgumentException('Date source string is not a real path');

            $year = date('Y', filectime($realpath));
        }
        else
            $year = $dateSource->format('Y');

        $siteYear = trim(SITE_CREATEDYEAR);

        $this->years = ($year !== $siteYear)
            ? "$siteYear &ndash; $year"
            : $siteYear;

        $this->author = $siteAuthor;

        return parent::__construct();
    }
}