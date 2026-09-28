<?php declare(strict_types=1);

use App\Enums\UserPermission;
use App\Services\SessionService;
use App\Utils\Component;

$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */
$sessionService->enforcePermissions([ UserPermission::Configuration ]);

$title = PAGE_ADMIN_TITLE;

?>

<?php Component::include('tabs', [
    'containerId' => 'admin__content',
    'tabs' => [
        [ 'title' => 'Site settings', 'targetId' => 'admin-site', 'active' => '' ],
        [ 'title' => 'Posts', 'targetId' => 'admin-posts' ]
    ]
]) ?>

<div id="admin__content">
    <?php Component::include('admin/site-configuration', [
        'attributes' => [ 'id' => 'admin-site' ]
    ]) ?>
    <?php Component::include('admin/blog-post-administration', [
        'page' => $page,
        'attributes' => ['id' => 'admin-posts', 'hidden' => '' ]
    ]) ?>
</div>