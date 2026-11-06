<?php declare(strict_types=1);

namespace App\Components\Blog;

use App\Abstract\Component;
use App\Models\App\Pagination;
use App\Models\DB\BlogPost;

/**
 * @property-read BlogPost[] $posts 
 * @property-read Pagination $pagination
 * @property-read bool $hasEditPermissions;
 * 
 * @property static string $baseClass
 */
class BlogViewComponent extends Component {
    public readonly array $posts;
    public readonly Pagination $pagination;
    public readonly bool $hasEditPermissions;

    public static string $baseClass = 'blog-view';

    /**
     * @param BlogPost[] $posts
     * @param Pagination $pagination
     * @param bool $hasEditPermissions
     */
    public function __construct(array $posts, Pagination $pagination, bool $hasEditPermissions) {
        $this->posts = $posts;
        $this->pagination = $pagination;
        $this->hasEditPermissions = $hasEditPermissions;

        return parent::__construct();
    }
}
