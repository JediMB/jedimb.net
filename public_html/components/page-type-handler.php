<?php use Enums\PageType; ?>

<?php switch ($pageType): ?>
<?php case PageType::PHP: ?>
    <?php include $pagePath ?>
    <?php break ?>
<?php case PageType::Virtual: ?>
    Virtual
    <?php break ?>
<?php case PageType::Blog: ?>
    Blog
    <?php break ?>
<?php endswitch ?>