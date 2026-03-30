<?php declare(strict_types=1);

namespace Pages\Blog;

require_once 'services/blog-post.service.php';
require_once 'services/session.service.php';
require_once 'utilities/component.utility.php';

use Exception;
use Enums\UserPermission;
use Services\BlogPostService;
use Services\SessionService;
use Utilities\Component;

/** @var int|null $page */

if (!isset($page))
    throw new Exception('Page number data ($page) unset in Blog Edit page');

SessionService::getInstance()->enforcePermissions([ UserPermission::Editing ]);

$formId = 'blog__edit__form';

?>

<h2>Edit post</h2>

<?php if (!$page): ?>
    <div>No post specified.</div>
    <?php return ?>
<?php endif ?>

<?php $post = BlogPostService::getInstance()->getBlogPost($page) ?>

<?php if (!$post): ?>
    <div>Blog post (id: <?= $page ?>) not found.</div>
    <?php return; ?>
<?php endif ?>

<?php if ($post->publishedOn): ?>
    <div>
        Published on 
        <?php Component::include('created-modified-dates', [
            'createdOn' => $post->publishedOn
        ]) ?>
    </div>
<?php endif ?>
<div>
    Created on 
    <?php Component::include('created-modified-dates', [
        'createdOn' => $post->createdOn,
        'modifiedOn' => $post->modifiedOn
    ]) ?>
</div>

<blog-edit-content class="form-column">
    <?php Component::include('blog/blog-editor', [
        'formId' => $formId,
        'post' => $post
    ]) ?>

    <edit-options class="form-spaced-row">
        <options-group class="form-row-group">
            <label>
                <input id="blog-edit__toggle-pinned"
                    type="checkbox"
                    form="<?= $formId ?>"
                    name="isPinned">
                Pinned
            </label>
            <label>
                <input id="blog-edit__toggle-hidden"
                    type="checkbox"
                    form="<?= $formId ?>"
                    name="isHidden">
                Hidden
            </label>
        </options-group>
        <options-group class="form-row-group">
            <?php if (!$post->publishedOn): ?>
                <input hidden
                    id="blog-edit__scheduled-date"
                    type="date"
                    form="<?= $formId ?>"
                    name="scheduledDate">
                <input hidden
                    id="blog-edit__scheduled-time"
                    type="time"
                    form="<?= $formId ?>"
                    name="scheduledTime"
                    step="60">
                <label>
                    <input id="blog-edit__toggle-schedule"
                        type="checkbox"
                        form="<?= $formId ?>"
                        name="isScheduled">
                    Schedule
                </label>
            <?php endif ?>
        </options-group>
    </edit-options>

    <edit-buttons class="form-spaced-row">
        <button id="blog-edit__btn-cancel"
            class="btn-warn btn-hover-heavy">
                Cancel
        </button>
        <buttons-save class="form-matching-buttons">
            <button id="blog-edit__btn-publish"
                type="submit"
                form="<?= $formId ?>"
                class="btn-primary"
                data-content-publish="Publish"
                data-content-schedule="Schedule"
                disabled>
                    Publish
            </button>
            <button id="blog-edit__btn-save"
                class="btn-secondary"
                disabled>
                    Save
            </button>
        </buttons-save>
    </edit-buttons>
</blog-edit-content>