<?php declare(strict_types=1);

namespace Components;

require_once 'services/image-gallery.service.php';
require_once 'services/table-modified.service.php';
require_once 'utilities/component.utility.php';
require_once 'utilities/datetime.utility.php';

use Enums\UserPermission;
use Models\DB\Image;
use Services\ImageGalleryService;
use Services\SessionService;
use Services\TableModifiedService;
use Utilities\Component;
use Utilities\DateTime;

$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */
$sessionService->enforcePermissions([UserPermission::Publishing]);

$tableModService = TableModifiedService::getInstance(); /** @var TableModifiedService $tableModService */
$imgService = ImageGalleryService::getInstance(); /** @var ImageGalleryService $imgService */

if (empty($GLOBALS['images']))
    $GLOBALS['images'] = $imgService->getImages();
$images = $GLOBALS['images']; /** @var Image[] $images */

if (empty($GLOBALS['galleries']))
    $GLOBALS['galleries'] = $imgService->getGalleries();
$galleries = $GLOBALS['galleries']; /** @var Gallery[] $galleries */

$insertAttribute = ( empty($insertTarget) ? [] : [ 'insert-target' => $insertTarget] );

$cPrefix = 'image-gallery';

Component::renderCSS();
Component::addJSModule();

?>

<image-gallery-header>
    <h2>Image gallery</h2>
    <div class="image-upload-buttons" data-tab="images">
        <button btn-image-upload disabled>Upload image</button>
        <button btn-cancel-upload hidden>Cancel</button>
    </div>
    <div hidden class="gallery-create-buttons" data-tab="galleries">
        <button btn-gallery-create disabled>Create gallery</button>
        <button btn-cancel-create hidden>Cancel</button>
    </div>
</image-gallery-header>
<image-gallery-body>
    <manager-tabs>
        <ul class="tab-list" role="tablist">
            <li class="tab-item">
                <button type="button"
                    role="tab"
                    class="tab-images active"
                    aria-pressed="true"
                    aria-controls="<?= "{$cPrefix}__image-manager-$cId" ?>"
                    >
                    <h3>Images</h3>
                </button>
            </li>
            <li class="tab-item">
                <button type="button"
                    role="tab"
                    class="tab-galleries"
                    aria-controls="<?= "{$cPrefix}__gallery-manager-$cId" ?>"
                    >
                    <h3>Galleries</h3>
                </button>
                </label>
            </li>
        </ul>
    </manager-tabs>
    <?php Component::include('image-gallery/image-manager', [
        'attributes' => [
            'id' => "{$cPrefix}__image-manager-$cId",
            'role' => 'tabpanel',
            'data-modified-on' => DateTime::toPrecisionString($tableModService->getOrCreateModifiedDate('image'))
        ] + $insertAttribute,
        'images' => $images
    ]) ?>
    <?php Component::include('image-gallery/gallery-manager', [
        'attributes' => [
            'id' => "{$cPrefix}__gallery-manager-$cId",
            'role' => 'tabpanel',
            'data-modified-on' => DateTime::toPrecisionString($tableModService->getOrCreateModifiedDate('gallery')),
            'hidden' => ''
        ] + $insertAttribute,
        'galleries' => $galleries,
        'images' => $images
    ]) ?>        
</image-gallery-body>