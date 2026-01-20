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
    <gallery-list tabindex="0" aria-label="List of image galleries.">
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
        <images-included tabindex="0" aria-label="Heading and list of images included in the gallery.">
            <h4 class="gallery-images-header">In gallery:</h4>
            <fieldset disabled>
                <ul></ul>
            </fieldset>
        </images-included>
        <images-excluded tabindex="0" aria-label="Heading and list of images excluded from the gallery.">
            <h4 class="gallery-images-header">Not in gallery:</h4>
            <fieldset disabled>
                <ul>
                    <?php foreach ($images as $image): ?>
                        <?php
                        $imageTitle = htmlspecialchars($image->title);
                        ?>
                        <li class="manager-list-item">
                            <label class="image-title" title="<?= $imageTitle ?>">
                                <input type="hidden" data-image-id="<?= $image->id ?>"
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
                    <input type="hidden">
                </label>
            </li>
        </template>
    </manager-gallery-images>
    <manager-buttons>
        <div><button btn-delete-gallery hidden title="Delete empty gallery">Delete</button></div>
        <div><button btn-save-gallery disabled title="Save all changes">Save</button></div>
    </manager-buttons>
</manager-selected-gallery>
<manager-create-gallery hidden>
    <h4>Create gallery</h4>
    <form>
        <div>
            <label for="title">Title:</label>
            <input full-width type="text" name="title" placeholder="A short, descriptive name." value="" required>
        </div>
        <div>
            <label for="description">Description:</label>
            <textarea full-width name="description" rows="3" placeholder="A useful description of the content of the image. Used by screen readers." required></textarea>
        </div>
    </form>
</manager-create-gallery>