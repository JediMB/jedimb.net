<?php declare(strict_types=1);

namespace App\Components\Blog;

use App\Abstract\Component;
use App\Models\DB\BlogPost;

class BlogPostShortComponent extends Component {
    public readonly ?BlogPost $post;
    public readonly bool $hasEditPermissions;

    public static string $baseClass = 'blog-post-short';

    public function __construct(BlogPost|false $post, bool $hasEditPermissions = false) {
        $this->post = $post ?: null;
        $this->hasEditPermissions = $hasEditPermissions;

        return parent::__construct();
    }
}
