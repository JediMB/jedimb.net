<?php declare(strict_types=1);

require_once 'services/social-link.service.php';

use Models\SocialLink;
use Services\SocialLinkService;

$socials = SocialLinkService::getInstance()->getSocialLinks();
$symbolPrefix = 'svg-social-link-';

?>

<svg class="hidden" xmlns="http://www.w3.org/2000/svg">
    <?php foreach ($socials as $link): ?>
        <?php /** @var SocialLink $link */ ?>
        <symbol
            id="<?= $symbolPrefix . $link->id ?>"
            width="2rem" height="2rem"
            viewBox="<?= $link->svgViewBox ?>"
            fill="inherit">
            <?= $link->svgContent ?>
        </symbol>
    <?php endforeach ?>
</svg>
<?php foreach ($socials as $link): ?>
    <?php $href = "#$symbolPrefix" . $link->id ?>
    <a href="<?= $link->url ?>"
        title="<?= $link->description ?>"
        target="_blank"
        class="social-link"
        aria-label="Social link to <?= $link->description ?>">
        <svg width="2rem" height="2rem">
            <use xlink:href="#<?= $href ?>"
                href="<?= $href ?>"></use>
        </svg>
    </a>
<?php endforeach ?>