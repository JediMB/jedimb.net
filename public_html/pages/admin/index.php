<?php declare(strict_types=1);

require_once 'services/session.service.php';
require_once 'utilities/component.utility.php';

use Enums\UserPermission;
use Services\SessionService;
use Utilities\Component;

$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */
$sessionService->enforcePermissions([ UserPermission::Configuration ]);

$title = PAGE_ADMIN_TITLE;

?>

<?php Component::include('tabs', [
    'containerId' => 'admin__content',
    'tabs' => [
        [ 'title' => 'Site settings', 'targetId' => 'admin-site' ],
        [ 'title' => 'Posts', 'targetId' => 'admin-posts', 'active' => '' ]
    ]
]) ?>

<div id="admin__content">
    <?php Component::include('admin/site-configuration', [
        'attributes' => [ 'id' => 'admin-site', 'hidden' => '' ]
    ]) ?>
    <?php Component::include('admin/blog-post-administration', [
        'attributes' => ['id' => 'admin-posts' ]
    ]) ?>
</div>