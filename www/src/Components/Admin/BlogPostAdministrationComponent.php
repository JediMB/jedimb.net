<?php declare(strict_types=1);

namespace App\Components\Admin;

use App\Abstract\Component;

class BlogPostAdministrationComponent extends Component {
    public readonly string $property;

    public function __construct(string $param) {
        $this->property = $param;

        return parent::__construct();
    }
}
