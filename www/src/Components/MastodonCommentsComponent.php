<?php declare(strict_types=1);

namespace App\Components;

use App\Abstract\Component;

class MastodonCommentsComponent extends Component {
    public readonly bool $isValid;
    public readonly ?string $id;
    public readonly ?string $user;
    public readonly ?string $host;

    public function __construct(?string $mastolink)
    {
        $linkComponents = [];
        if (($isValid = $mastolink && preg_match(REGEX_PHP['mastolink'], $mastolink, $linkComponents))) {
            $this->host = $linkComponents[1];
            $this->user = $linkComponents[2];
            $this->id = $linkComponents[3];
        }

        $this->isValid = $isValid;

        return parent::__construct();
    }
}