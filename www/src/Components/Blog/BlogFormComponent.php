<?php declare(strict_types=1);

namespace App\Components\Blog;

use App\Abstract\Component;
use App\Models\App\Permalink;
use App\Models\DB\BlogPost;
use App\Models\DB\BlogPostSchedule;
use App\Services\BlogPostScheduleService;

class BlogFormComponent extends Component {
    public readonly string $formId;
    public readonly ?BlogPost $post;
    public readonly ?BlogPostSchedule $schedule;
    public readonly Permalink $permalink;

    public static string $baseClass = 'blog-form';

    public function __construct(string $formId, BlogPost|false $post) {
        $this->formId = $formId;
        $this->post = $post ?: null;

        $this->permalink = new Permalink($this->post?->permalink);

        if (!$post || $post->publishedOn)
            $this->schedule = null;
        else
            $this->schedule = BlogPostScheduleService::getInstance()->getBlogPostSchedule($post->id);

        return parent::__construct();
    }
}
