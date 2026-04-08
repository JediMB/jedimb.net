<?php declare(strict_types=1);

namespace Components\Blog;

require_once 'models/db/blog-post.db.model.php';
require_once 'utilities/component.utility.php';

use Exception;
use Models\DB\BlogPost;
use Services\BlogPostScheduleService;
use Utilities\Component;

/** @var BlogPost $post */

if (empty($post))
    throw new Exception('Post data ($post) not provided in blog Editor component');

$schedule = $post->publishedOn
    ? false
    : BlogPostScheduleService::getInstance()->getBlogPostSchedule($post->id);

$formId = 'blog-editor__form';

Component::renderOnce();
Component::addJSModule();

?>

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

<blog-editor-content class="form-column">
    <?php Component::include('blog/blog-form', [
        'formId' => $formId,
        'post' => $post
    ]) ?>

    <edit-options class="form-spaced-row">
        <options-group class="form-row-group">
            <label>
                <input id="blog-editor__toggle-pinned"
                    type="checkbox"
                    form="<?= $formId ?>"
                    name="isPinned"
                    <?= $post->isPinned ? 'checked' : null ?>
                    >
                Pinned
            </label>
            <label>
                <input id="blog-editor__toggle-hidden"
                    type="checkbox"
                    form="<?= $formId ?>"
                    name="isHidden"
                    <?= $post->isHidden ? 'checked' : null ?>
                    >
                Hidden
            </label>
        </options-group>
        <options-group class="form-row-group">
            <?php if (!$post->publishedOn): ?>
                <input <?= $schedule ? null : 'hidden'  ?>
                    id="blog-editor__scheduled-date"
                    type="date"
                    form="<?= $formId ?>"
                    name="scheduledDate"
                    value="<?= $schedule ? $schedule->publishOn->format('Y-m-d') : null ?>">
                <input <?= $schedule ? null : 'hidden'  ?>
                    id="blog-editor__scheduled-time"
                    type="time"
                    form="<?= $formId ?>"
                    name="scheduledTime"
                    step="60"
                    value="<?= $schedule ? $schedule->publishOn->format('H:i') : null ?>">
                <label>
                    <input id="blog-editor__toggle-schedule"
                        type="checkbox"
                        form="<?= $formId ?>"
                        name="isScheduled"
                        <?= $schedule ? 'checked' : null ?>
                        >
                    Schedule
                </label>
            <?php endif ?>
        </options-group>
    </edit-options>

    <edit-buttons class="form-spaced-row">
        <button id="blog-editor__btn-cancel"
            class="btn-warn btn-hover-heavy"
            disabled>
                Cancel
        </button>
        <buttons-save class="form-matching-buttons">
            <button id="blog-editor__btn-save"
                form="<?= $formId ?>"
                class="<?= $post->publishedOn ? 'btn-primary' : 'btn-secondary' ?>"
                disabled>
                    Save
            </button>
            <?php if (!$post->publishedOn): ?>
                <button id="blog-editor__btn-publish"
                    class="btn-primary"
                    data-content-publish="Publish"
                    data-content-schedule="Schedule"
                    disabled>
                        Publish
                </button>
            <?php endif ?>
        </buttons-save>
    </edit-buttons>
</blog-editor-content>