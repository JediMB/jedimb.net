<?php declare(strict_types=1);

use App\Components\ContentTimestampsComponent;

/** @var ContentTimestampsComponent $data */

?>

<span>
    <date-time class="created-on"
        date-string="<?= $data->createdOn ?>"
        relative-date="<?= $data->showRelativeDate ?>"
        >
        <?= $data->createdOn ?>
    </date-time>
</span>

<?php if ($data->modifiedOn): ?>
    <span class="weak">
        &ndash; Last modified
        <date-time class="modified-on"
            date-string="<?= $data->modifiedOn ?>"
            relative-date="<?= $data->showRelativeDate ?>"
            >
            <?= $data->modifiedOn ?>
    </date-time>
    </span>
<?php endif ?>