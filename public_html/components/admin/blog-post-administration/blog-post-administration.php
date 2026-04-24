<?php declare(strict_types=1);

namespace Components\Admin;

require_once 'services/blog-post.service.php';
require_once 'utilities/component.utility.php';

use Services\BlogPostService;
use Utilities\Component;

$blogPostService = BlogPostService::getInstance();
$data = $blogPostService->getBlogPostsAdminData(1, 10);
$posts = $data['blogPosts'];
$pagination = $data['pagination'];

Component::renderOnce();
Component::renderCSS();
Component::addJSModule();

?>

<h3 class="h3">Posts</h3>

<?php foreach ($posts as $post): ?>
    <div><?= $post->title ?></div>
<?php endforeach  ?>