<?php declare(strict_types=1);

namespace App\Components\Admin;

use App\Abstract\Component;
use App\Models\DB\BlogPost;

class BlogPostComponent extends Component {
    public readonly BlogPost|null $post;

    public static string $baseClass = 'blog-post';

    /** @param BlogPost|false $post The BlogPost to render, or false for an empty template */
    public function __construct(BlogPost|false $post) {
        $this->post = $post ?: null;

        return parent::__construct();
    }
}