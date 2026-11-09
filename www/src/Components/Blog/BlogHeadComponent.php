<?php declare(strict_types=1);

namespace App\Components\Blog;

use App\Abstract\Component;

class BlogHeadComponent extends Component {
    public readonly string $property;

    public static string $baseClass = 'blog-head';

    public function __construct() {
        return parent::__construct();
    }
}
