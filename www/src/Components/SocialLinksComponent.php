<?php declare(strict_types=1);

namespace App\Components;

use App\Abstract\Component;
use App\Models\DB\SocialLink;

/**
 * @property-read SocialLink[] $socialLinks
 * @property-read string $symbolPrefix
 */
class SocialLinksComponent extends Component {
    public readonly array $socialLinks;
    public readonly string $symbolPrefix;

    /** @param SocialLink[] $socialLinks */
    public function __construct(array $socialLinks) {
        $this->socialLinks = $socialLinks;
        $this->symbolPrefix = "svg-social-link-";

        return parent::__construct();
    }
}