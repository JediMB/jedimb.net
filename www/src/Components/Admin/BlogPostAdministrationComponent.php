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

    /** @param positive-int $pageNumber */
    public function __construct(int $pageNumber) {
        $service = BlogPostService::getInstance();
        $data = $service->getBlogPostsAdminData($pageNumber);

        $this->posts = $data['blogPosts'];
        $this->pagination = $data['pagination'];

        return parent::__construct();
    }
}

?>

<style>
    .blog-post-admin__list {
        display: block grid;
        grid-template-columns: 1.5em 1fr auto;
        grid-auto-rows: 1fr;
        gap: var(--size-m);
        margin-block: var(--size-l);
        align-items: center;
    }

    .admin__blog-post {
        display: contents;
    }

    .admin__blog-post__buttons {
        display: inline flex;
        flex-direction: row;
        gap: var(--size-s);
    }

    .admin__blog-post__link {
        display: inline flex;
        flex-direction: row;
        gap: 0.75ch;
        align-items: center;
    }
</style>