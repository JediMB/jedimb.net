<?php declare(strict_types=1);

namespace App\Models\App;

class Permalink {
    public readonly string $prefix;
    public readonly string $date;
    public readonly string $title;

    public function __construct(?string $permalink) {
        $this->prefix = '/' . PATH_BLOG_PREFIX . '/';

        $date = date('Y/m/d');
        $title = '';
        
        $matches = [];
        if ($permalink && preg_match(REGEX_PHP['permalink_date_title'], $permalink, $matches)) {
            if ($matches[1] > $date)
                $date = $matches[1];

            $title = $matches[2];
        }

        $this->date = $date;
        $this->title = $title;
    }

    public function __toString() : string {
        return $this->prefix . $this->date . '/' .  $this->title;
    }
}