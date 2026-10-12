<?php declare(strict_types=1);

use App\Components\PageSelectorComponent;

/** @var PageSelectorComponent $data */

$currentPage = $data->currentPage;
$totalPages = $data->totalPages;

?>

<page-selector-component
    base-route="<?= CURRENT_PAGE_ROUTE ?>"
    data-csv="<?= $data->csv ?>"
    >
    <nav>
        <ul page-nav class="page-selector__list">
            <li>
                <a href="<?= CURRENT_PAGE_ROUTE ?>/1"
                    onclick="return false;"
                    title="First page"
                    target-page="1"
                    <?= $currentPage < 3 ? 'disabled' : null ?>
                    class="page-selector__link"
                    page-first
                    >
                    <svg width="1em" height="1em" class="margin-auto">
                        <use xlink:href="#svg-first" href="#svg-first"></use>
                    </svg>
                </a>
            </li>
            <li>
                <a href="<?= CURRENT_PAGE_ROUTE ?>/<?= $data->prevPage ?>"
                    onclick="return false;"
                    title="Previous page"
                    target-page="<?= $data->prevPage ?>"
                    <?= $currentPage === 1 ? 'disabled' : null ?>
                    class="page-selector__link"
                    page-prev
                    >
                    <svg width="1em" height="1em" class="margin-auto">
                        <use xlink:href="#svg-left" href="#svg-left"></use>
                    </svg>
                </a>
            </li>
            <li>
                <ul page-list class="page-selector__list">
                    <?php foreach ($data->pageNumbers as $pageNumber): ?>
                        <li>
                            <a href="<?= CURRENT_PAGE_ROUTE ?>/<?= $pageNumber ?>"
                                onclick="return false;"
                                title="Page <?= $pageNumber ?>"
                                target-page="<?= $pageNumber ?>"
                                class="page-selector__link <?= $pageNumber === $currentPage ? 'active' : null ?>"
                                >
                                <?= $pageNumber ?>
                            </a>
                        </li>
                    <?php endforeach ?>
                </ul>
            </li>
            <li>
                <a href="<?= CURRENT_PAGE_ROUTE ?>/<?= $data->nextPage ?>"
                    onclick="return false;"
                    title="Next page"
                    target-page="<?= $data->nextPage ?>"
                    <?= $currentPage === $totalPages ? 'disabled' : null ?>
                    class="page-selector__link"
                    page-next
                    >
                    <svg width="1em" height="1em" class="margin-auto">
                        <use xlink:href="#svg-right" href="#svg-right"></use>
                    </svg>
                </a>
            </li>
            <li>
                <a href="<?= CURRENT_PAGE_ROUTE ?>/<?= $totalPages ?>"
                    onclick="return false;"
                    title="Last page"
                    target-page="<?= $totalPages ?>"
                    <?= $currentPage > $totalPages - 2 ? 'disabled' : null ?>
                    class="page-selector__link"
                    page-last
                    >
                    <svg width="1em" height="1em" class="margin-auto">
                        <use xlink:href="#svg-last" href="#svg-last"></use>
                    </svg>

                </a>
            </li>
        </ul>
    </nav>
</page-selector-component>