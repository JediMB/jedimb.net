<?php declare(strict_types=1);

namespace Components;

require_once 'services/image-gallery.service.php';
require_once 'services/table-modified.service.php';
require_once 'utilities/component.utility.php';
require_once 'utilities/datetime.utility.php';

use Enums\UserPermission;
use Models\DB\Gallery;
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

Component::renderCSS();
Component::addJSModule();

?>

<image-manager-header>
    <h2>Image manager</h2>
    <div class="image-upload-buttons" data-tab="images">
        <button btn-image-upload disabled>Upload image</button>
        <button btn-cancel-upload hidden>Cancel</button>
    </div>
    <div hidden class="gallery-create-buttons" data-tab="galleries">
        <button btn-gallery-create disabled>Create gallery</button>
        <button btn-cancel-create hidden>Cancel</button>
    </div>
</image-manager-header>
<image-manager-body>
    <manager-tabs>
        <ul class="tab-list">
            <li class="tab-item"><label class="tab-label"><input hidden type="radio" name="image-tabs" data-tab-target="images"><h3>Images</h3></label></li>
            <li class="tab-item"><label class="tab-label"><input hidden type="radio" name="image-tabs" data-tab-target="galleries" checked><h3>Galleries</h3></label></li>
        </ul>
    </manager-tabs>
    <image-manager data-tab="images" data-modified-on="<?= DateTime::ToPrecisionString($tableModService->getOrCreateModifiedDate('image')) ?>">
        <manager-images>
            <manager-files data-gallery-path="<?= ($galleryPath = '/' . PATH_IMAGE_GALLERY . '/') ?>">
                <fieldset disabled>
                    <ul>
                        <?php foreach ($images as $image): ?>
                            <?php
                            $imageUrl = $galleryPath . "$image->filename";
                            $imageTitle = htmlspecialchars($image->title);
                            $imageDesc = htmlspecialchars($image->description);
                            ?>
                            <li class="manager-list-item">
                                <label class="image-title" title="<?= $imageTitle ?>">
                                    <input hidden type="radio" name="images"
                                        data-image-id="<?= $image->id ?>"
                                        data-image-filename="<?= $image->filename ?>"
                                        data-image-url="<?= $imageUrl ?>"
                                        data-image-title="<?= $imageTitle ?>"
                                        data-image-default-title="<?= $imageTitle ?>"
                                        data-image-description="<?= $imageDesc ?>"
                                        data-image-default-description="<?= $imageDesc ?>"
                                        data-image-created-on="<?= DateTime::ToString($image->createdOn) ?>"
                                        data-image-modified-on="<?= DateTime::ToString($image->modifiedOn) ?>"
                                    >
                                    <?= $imageTitle ?>
                                </label>
                                <img hidden src="<?= $imageUrl ?>">
                            </li>
                        <?php endforeach ?>
                    </ul>
                </fieldset>
                <template item-template>
                    <li class="manager-list-item">
                        <label class="image-title">
                            <input hidden type="radio" name="images">
                        </label>
                        <img hidden>
                    </li>
                </template>
            </manager-files>
            <manager-buttons>
                <div><button btn-insert disabled hidden>Insert</button></div>
                <div><button btn-delete disabled>Delete</button></div>
            </manager-buttons>
        </manager-images>
        <manager-properties>
            <form autocomplete="off">
                <image-properties>
                    <div style="width: 100%; max-height: 100%; aspect-ratio: 1;">&nbsp;</div>
                </image-properties>
                <manager-buttons>
                    <div><button btn-reset type="reset" disabled>Reset</button></div>
                    <div>
                        <button btn-save type="submit" disabled
                            data-content-edit="Save"
                            data-content-upload="Upload">
                            Save
                        </button>
                    </div>
                </manager-buttons>
            </form>
        </manager-properties>
        <template properties-template>
            <h4 class="image-header"></h4>
            <div class="image-preview"></div>
            <input type="hidden" name="id" value="0">
            <div>
                <label for="title">Title:</label>
                <input full-width type="text" name="title" placeholder="A short, descriptive name." value="" required>
            </div>
            <div>
                <label for="description">Description:</label>
                <textarea full-width name="description" rows="3" placeholder="A useful description of the content of the image. Used by screen readers." required></textarea>
            </div>
            <div class="image-dates">
                <div>Created on: <span class="created-on"></span></div>
                <div>Modified on: <span class="modified-on"></span></div>
            </div>
        </template>
        <template upload-template>
            <h4>Upload image</h4>
            <div class="image-preview"></div>
            <input type="file" name="image" accept="image/png, image/jpeg" size="0" required>
            <div>
                <label for="title">Title:</label>
                <input full-width type="text" name="title" placeholder="A short, descriptive name." value="" required>
            </div>
            <div>
                <label for="description">Description:</label>
                <textarea full-width name="description" rows="3" placeholder="A useful description of the content of the image. Used by screen readers." required></textarea>
            </div>
        </template>
    </image-manager>
    <gallery-manager hidden data-tab="galleries" data-modified-on="<?= DateTime::ToPrecisionString($tableModService->getOrCreateModifiedDate('gallery')) ?>">
        <manager-galleries>
            <gallery-list>
                <fieldset>
                    <ul>
                        <?php foreach ($galleries as $gallery): ?>
                            <?php
                            $galleryTitle = htmlspecialchars($gallery->title);
                            $galleryDesc = htmlspecialchars($gallery->description);
                            ?>
                            <li class="manager-list-item">
                                <label class="gallery-title" title="">
                                    <input hidden type="radio" name="galleries"
                                        data-gallery-id="<?= $gallery->id ?>"
                                        data-gallery-title="<?= $galleryTitle ?>"
                                        data-gallery-default-title="<?= $galleryTitle ?>"
                                        data-gallery-description="<?= $galleryDesc ?>"
                                        data-gallery-default-description="<?= $galleryDesc ?>"
                                        data-gallery-created-on="<?= DateTime::ToString($gallery->createdOn) ?>"
                                        data-gallery-modified-on="<?= DateTime::ToString($gallery->modifiedOn) ?>"
                                    >
                                    <?= $galleryTitle ?>
                                </label>
                            </li>
                        <?php endforeach ?>
                    </ul>
                </fieldset>
            </gallery-list>
            <manager-buttons>
                <div><button btn-insert-gallery title="Insert gallery" disabled hidden>Insert</button></div>
                <div><button btn-edit title="Edit gallery details" disabled>Edit</button></div>
            </manager-buttons>
        </manager-galleries>
        <manager-selected-gallery>
            <manager-gallery-images>
                <images-included>
                    <h4 class="gallery-images-header">In gallery:</h4>
                    <fieldset disabled>
                        <ul>
                            <li class="manager-list-item">
                                <label class="image-title">
                                    <input hidden type="radio" name="images">
                                    &nbsp;
                                </label>
                            </li>
                        </ul>
                    </fieldset>
                </images-included>
                <images-excluded>
                    <h4 class="gallery-images-header">Not in gallery:</h4>
                    <fieldset disabled>
                        <ul>
                            <?php foreach ($images as $image): ?>
                                <?php
                                $imageTitle = htmlspecialchars($image->title);
                                ?>
                                <li class="manager-list-item">
                                    <label class="image-title" title="<?= $imageTitle ?>">
                                        <input hidden type="radio" name="gallery-images"
                                            data-image-id="<?= $image->id ?>"
                                        >
                                        <?= $imageTitle ?>
                                    </label>
                                </li>
                            <?php endforeach ?>
                        </ul>
                    </fieldset>
                </images-excluded>
                <template gallery-image-template>
                    <li class="manager-list-item">
                        <label class="image-title">
                            <input hidden type="radio">
                        </label>
                    </li>
                </template>
            </manager-gallery-images>
            <div>
                <manager-buttons>
                    <div class="buttons-add-remove"><button btn-remove full-width disabled title="Remove from gallery">&minus;</button></div>
                    <div class="buttons-add-remove"><button btn-add full-width disabled title="Add to gallery">&plus;</button></div>
                </manager-buttons>
                <manager-buttons>
                    <div><button btn-reset-gallery disabled hidden title="Undo all changes">Reset</button></div>
                    <div><button btn-save-gallery disabled title="Save all changes">Save</button></div>
                </manager-buttons>
            </div>
        </manager-selected-gallery>
    </gallery-manager>
</image-manager-body>