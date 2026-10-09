<?php declare(strict_types=1);

namespace App\Components;

use App\Abstract\Component;

class AccountMenuComponent extends Component {
    public readonly bool $isLoggedIn;

    public function __construct(bool $isLoggedIn) {
        $this->isLoggedIn = $isLoggedIn;

        return parent::__construct();
    }
}
