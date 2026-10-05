<?php declare(strict_types=1);

use App\Components\SocialLinksComponent;

/** @var SocialLinksComponent $data */

$symbolPrefix = $data->symbolPrefix;

?>

<svg hidden xmlns="http://www.w3.org/2000/svg">
    <?php foreach ($data->socialLinks as $link): ?>
        <symbol id="<?= $symbolPrefix . $link->id ?>"
            width="2rem" height="2rem"
            viewBox="<?= $link->svgViewBox ?>"
            fill="inherit"
            >
            <?= $link->svgContent ?>
        </symbol>
    <?php endforeach ?>
</svg>
<?php foreach ($data->socialLinks as $link): ?>
    <a href="<?= $link->url ?>"
        title="<?= $link->description ?>"
        target="_blank"
        class="social-link"
        aria-label="Social link to <?= $link->description ?>"
        >
        <svg width="2rem" height="2rem">
            <use xlink:href="#<?= $symbolPrefix . $link->id ?>"
                href="#<?= $symbolPrefix . $link->id ?>"></use>
        </svg>
    </a>
<?php endforeach ?>