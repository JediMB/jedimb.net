<?php declare(strict_types=1);

namespace App\Components\Admin;

use App\Abstract\Component;
use App\Models\App\Pagination;
use App\Models\DB\BlogPost;
use App\Services\BlogPostService;

/**
 * @property-read BlogPost[] $posts 
 * @property-read Pagination $pagination 
 */
class BlogPostAdministrationComponent extends Component {
    public readonly array $posts;
    public readonly Pagination $pagination;

    public static string $baseClass = 'blog-post-admin';

    /** @param positive-int $pageNumber */
    public function __construct(int $pageNumber) {
        $service = BlogPostService::getInstance();
        $data = $service->getBlogPostsAdminData($pageNumber);

        $this->posts = $data['blogPosts'];
        $this->pagination = $data['pagination'];

        return parent::__construct();
    }
}