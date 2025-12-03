<?php declare(strict_types=1);

namespace Components;

require_once 'services/image-gallery.service.php';
require_once 'utilities/component.utility.php';

use Enums\UserPermission;
use Models\DB\Image;
use Services\ImageGalleryService;
use Services\SessionService;
use Utilities\Component;

$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */
$sessionService->enforcePermissions([UserPermission::Publishing]);

$imgService = ImageGalleryService::getInstance(); /** @var ImageGalleryService $imgService */
if (empty($GLOBALS['images']))
    $GLOBALS['images'] = $imgService->getImages();
$images = $GLOBALS['images'];

Component::renderCSS();
Component::addJSModule();

?>

<h2>Image manager</h2>
<image-manager>
    <manager-tabs>
        <ul class="tab-list">
            <li class="tab-item"><label class="tab-label"><input hidden type="radio" name="image-tabs" checked>Images</label></li>
            <li class="tab-item"><label class="tab-label"><input hidden type="radio" name="image-tabs">Groups</label></li>
        </ul>
    </manager-tabs>
    <manager-content>
        <manager-list>
            <manager-files>
                <ul>
                    <?php foreach ($images as $image): ?>
                        <?php /** @var Image $image */ ?>
                        <li class="manager-list-item">
                            <label>
                                <input hidden type="radio" name="images"
                                    data-image-id="<?= $image->id ?>"
                                    data-image-filename="<?= $image->filename ?>"
                                    data-image-url="<?= '/' . PATH_IMAGE_GALLERY . "/$image->filename" ?>"
                                    data-image-title="<?= htmlspecialchars($image->title) ?>"
                                    data-image-description="<?= htmlspecialchars($image->description) ?>"
                                    data-image-created-on="<?= $image->createdOn->format('Y-m-d H:i:s O') ?>"
                                    data-image-modified-on="<?= $image->modifiedOn?->format('Y-m-d H:i:s O') ?>"
                                >
                                <?= $image->title ?>
                            </label>
                        </li>
                    <?php endforeach ?>
                </ul>
            </manager-files>
            <manager-buttons>
                <button>Insert</button>
                <button>Upload</button>
            </manager-buttons>
        </manager-list>
        <manager-properties>
            <h3 class="image-header">20251127_0835721.jpg</h3>
            <div class="image-preview">
                &nbsp;
            </div>
            <div>
                <form>
                    <div>
                        <label for="title">Title:</label>
                        <input full-width type="text" name="title" value="Dog with hat">
                    </div>
                    <div>
                        <label for="description">Description:</label>
                        <textarea full-width name="description" rows="3">The text that goes in the ALT field</textarea>
                    </div>
                    <div>Created on: 2025-11-27 13:45 (UTC+1)</div>
                    <div>Modified on: (unmodified)</div>
                </form>
            </div>
        </manager-properties>
        <template>
            <h3 class="image-header">Filename</h3>
            <div class="image-preview">
                &nbsp;
            </div>
            <div>
                <form>
                    <div>
                        <label for="title">Title:</label>
                        <input full-width type="text" name="title" value="Title">
                    </div>
                    <div>
                        <label for="description">Description:</label>
                        <textarea full-width name="description" rows="3">Description</textarea>
                    </div>
                    <div>Created on: 2025-11-27 13:45 (UTC+1)</div>
                    <div>Modified on: (unmodified)</div>
                </form>
            </div>
        </template>
    </manager-content>
</image-manager>