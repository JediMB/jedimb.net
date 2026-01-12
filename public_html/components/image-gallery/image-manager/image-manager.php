<?php declare(strict_types=1);

namespace Components\ImageGallery;

require_once 'utilities/component.utility.php';
require_once 'utilities/datetime.utility.php';

use Utilities\Component;
use Utilities\DateTime;

Component::renderCSS();
Component::addJSModule();

?>

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
    <label class="btn" data-text="Browse&hellip;" tabindex="0" aria-required="true" aria-roledescription="Browse the local file system for an image">
        <input type="file" name="image" accept="image/png, image/jpeg" size="0" required>
    </label>
    <div>
        <label for="title">Title:</label>
        <input full-width type="text" name="title" placeholder="A short, descriptive name." value="" required>
    </div>
    <div>
        <label for="description">Description:</label>
        <textarea full-width name="description" rows="3" placeholder="A useful description of the content of the image. Used by screen readers." required></textarea>
    </div>
</template>