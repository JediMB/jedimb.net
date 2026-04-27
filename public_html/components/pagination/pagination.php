<?php declare(strict_types=1);

namespace Components;

require_once 'models/pagination.model.php';
require_once 'utilities/component.utility.php';

use Exception;
use Models\Pagination;
use Utilities\Component;

/** @var int $cId */
/** @var Pagination $data */

if (empty($data) || get_class($data) !== Pagination::class)
    throw new Exception('Pagination data ($data) not provided for Pagination component');

Component::addAttributes([
    'base-route' => CURRENT_PAGE_ROUTE,
    'data-csv' => $data,
    'data-id' => $cId
]);

Component::renderCSS();
Component::addJSModule();

$currentPage = $data->page;
$totalPages = $data->pageCount;
$pageNumbers = [ $currentPage => $currentPage ];
$pageCount = 1;
$pageSteps = 1;

while ($pageCount < 5 && $pageSteps < 5) {
    $prev = max($currentPage - $pageSteps, 1);
    $pageNumbers[$prev] = $prev;

    $next = min($currentPage + $pageSteps, $totalPages);
    $pageNumbers[$next] = $next;

    if ( ($newCount = count($pageNumbers)) === $pageCount )
        break;

    $pageCount = $newCount;
    $pageSteps++;
}

ksort($pageNumbers);

$nextPage = min($totalPages, $currentPage + 1);

?>

<nav>
    <ul class="pagination__list">
        <li>
            <a href="<?= CURRENT_PAGE_ROUTE ?>/1"
                onclick="return false;"
                id="pagination__first-<?= $cId ?>"
                title="First page"
                target-page="1"
                <?= $currentPage < 3 ? 'disabled' : null ?>
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-first" href="#svg-first"></use>
                </svg>
            </a>
        </li>
        <li>
            <a href="<?= CURRENT_PAGE_ROUTE ?>/<?= max(1, $currentPage - 1) ?>"
                onclick="return false;"
                id="pagination__previous-<?= $cId ?>"
                title="Previous page"
                target-page="<?= max(1, $currentPage - 1) ?>"
                <?= $currentPage === 1 ? 'disabled' : null ?>
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-left" href="#svg-left"></use>
                </svg>
            </a>
        </li>
        <li>
            <ul id="pagination__pages-<?= $cId ?>" class="pagination__list">
                <?php foreach ($pageNumbers as $pageNumber): ?>
                    <li>
                        <a href="<?= CURRENT_PAGE_ROUTE ?>/<?= $pageNumber ?>"
                            onclick="return false;"
                            title="Page <?= $pageNumber ?>"
                            target-page="<?= $pageNumber ?>"
                            <?= $pageNumber === $currentPage ? 'class="active"' : null ?>
                            >
                            <?= $pageNumber ?>
                        </a>
                    </li>
                <?php endforeach ?>
            </ul>
        </li>
        <li>
            <a href="<?= CURRENT_PAGE_ROUTE ?>/<?= $nextPage ?>"
                onclick="return false;"
                id="pagination__next-<?= $cId ?>"
                title="Next page"
                target-page="<?= $nextPage ?>"
                <?= $currentPage === $totalPages ? 'disabled' : null ?>
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-right" href="#svg-right"></use>
                </svg>
            </a>
        </li>
        <li>
            <a href="<?= CURRENT_PAGE_ROUTE ?>/<?= $totalPages ?>"
                onclick="return false;"
                id="pagination__last-<?= $cId ?>"
                title="Last page"
                target-page="<?= $totalPages ?>"
                <?= $currentPage > $totalPages - 2 ? 'disabled' : null ?>
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-last" href="#svg-last"></use>
                </svg>
            </a>
        </li>
    </ul>
</nav>
