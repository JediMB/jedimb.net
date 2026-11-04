<?php declare(strict_types=1);

use App\Components\Admin\BlogPostAdministrationComponent;
use App\Components\Admin\SiteConfigurationComponent;
use App\Components\TabbedContentComponent;
use App\Enums\UserPermission;
use App\Models\App\Page;
use App\Models\App\TabbedContent;
use App\Services\SessionService;

/** @var Page $page */

$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */
$sessionService->enforcePermissions([ UserPermission::Configuration ]);

$page->title = PAGE_ADMIN_TITLE;

?>

<?= new TabbedContentComponent(
        new TabbedContent(
            'Site settings',
            'admin-site',
            new SiteConfigurationComponent()
        ),
        new TabbedContent(
            'Blog posts',
            'admin-posts',
            new BlogPostAdministrationComponent($page->pageNumber),
            true
        )
) ?>