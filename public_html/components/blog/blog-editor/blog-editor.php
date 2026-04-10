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
        'attributes' => [ 'id' => 'blog-editor__editor' ],
        'formId' => $formId,
        'post' => $post
    ]) ?>

    <edit-buttons class="form-spaced-row">
        <button id="blog-editor__btn-cancel"
            class="btn-warn btn-hover-heavy"
            disabled>
                Cancel
        </button>
        <buttons-save class="form-matching-buttons">
            <button id="blog-editor__btn-save"
                type="submit"
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