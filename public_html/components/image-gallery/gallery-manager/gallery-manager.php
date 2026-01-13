<?php declare(strict_types=1);

namespace Components\ImageGallery;

require_once 'utilities/component.utility.php';
require_once 'utilities/datetime.utility.php';

use Models\DB\Gallery;
use Utilities\Component;
use Utilities\DateTime;

Component::hide();
Component::renderCSS();
Component::addJSModule();

?>

<manager-galleries>
    <gallery-list>
        <fieldset disabled>
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
                <ul></ul>
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
            <li class="manager-list-item" draggable="true">
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
            <div><button btn-delete-gallery hidden title="Delete empty gallery">Delete</button></div>
            <div><button btn-save-gallery disabled title="Save all changes">Save</button></div>
        </manager-buttons>
    </div>
</manager-selected-gallery>