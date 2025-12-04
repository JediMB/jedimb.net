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
<div>
    <manager-tabs>
        <ul class="tab-list">
            <li class="tab-item"><label class="tab-label"><input hidden type="radio" name="image-tabs" checked>Images</label></li>
            <li class="tab-item"><label class="tab-label"><input hidden type="radio" name="image-tabs">Groups</label></li>
        </ul>
    </manager-tabs>
    <image-manager>
        <manager-list>
            <manager-files>
                <ul>
                    <?php foreach ($images as $image): ?>
                        <?php /** @var Image $image */
                            $imageUrl = '/' . PATH_IMAGE_GALLERY . "/$image->filename";
                            $imageTitle = htmlspecialchars($image->title);
                            $imageDesc = htmlspecialchars($image->description);
                        ?>
                        <li class="manager-list-item">
                            <label>
                                <input hidden type="radio" name="images"
                                    data-image-id="<?= $image->id ?>"
                                    data-image-filename="<?= $image->filename ?>"
                                    data-image-url="<?= $imageUrl ?>"
                                    data-image-title="<?= $imageTitle ?>"
                                    data-image-default-title="<?= $imageTitle ?>"
                                    data-image-description="<?= $imageDesc ?>"
                                    data-image-default-description="<?= $imageDesc ?>"
                                    data-image-created-on="<?= $image->createdOn->format('Y-m-d H:i:s O') ?>"
                                    data-image-modified-on="<?= $image->modifiedOn?->format('Y-m-d H:i:s O') ?>"
                                >
                                <?= $image->title ?>
                            </label>
                            <img hidden src="<?= $imageUrl ?>">
                        </li>
                    <?php endforeach ?>
                </ul>
            </manager-files>
            <manager-buttons>
                <div><button btn-insert disabled>Insert</button></div>
                <div><button btn-upload>Upload</button></div>
            </manager-buttons>
        </manager-list>
        <manager-properties>
            <form autocomplete="off">
                <image-properties></image-properties>
                <manager-buttons>
                    <div><button btn-reset type="reset" disabled>Undo</button></div>
                    <div><button btn-save type="submit" disabled>Save</button></div>
                </manager-buttons>
            </form>
        </manager-properties>
        <template>
            <h3 class="image-header"></h3>
            <div class="image-preview"></div>
            <input type="hidden" name="id" value="0">
            <div>
                <label for="title">Title:</label>
                <input full-width type="text" name="title" value="" required>
            </div>
            <div>
                <label for="description">Description:</label>
                <textarea full-width name="description" rows="3" required></textarea>
            </div>
            <div class="image-dates">
                <div>Created on: <span class="created-on"></span></div>
                <div>Modified on: <span class="modified-on"></span></div>
            </div>
        </template>
    </image-manager>
    <group-manager></group-manager>
</div>