<?php declare(strict_types=1);

namespace App\Components\Blog;

use App\Abstract\Component;

class BlogViewComponent extends Component {
    public readonly string $property;

    public static string $baseClass = 'blog-view';

    public function __construct(string $param) {
        $this->property = $param;

        return parent::__construct();
    }
}
