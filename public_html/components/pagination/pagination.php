<?php declare(strict_types=1);

namespace Components;

require_once 'models/pagination.model.php';
require_once 'utilities/component.utility.php';

use Exception;
use Models\Pagination;
use Utilities\Component;

/** @var Pagination $data */
/** @var string $baseRoute */

if (empty($data) || get_class($data) !== Pagination::class)
    throw new Exception('Pagination data ($data) not provided for Pagination component');
if (!isset($baseRoute) || !is_string($baseRoute))
    throw new Exception('Base path string data ($basePath) not provided for BlogView component');

Component::addAttributes([
    'base-route' => $baseRoute,
    'data-csv' => $data
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
            <a href="<?= $baseRoute ?>/1"
                onclick="return false;"
                id="pagination__first"
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
            <a href="<?= $baseRoute ?>/<?= max(1, $currentPage - 1) ?>"
                onclick="return false;"
                id="pagination__previous"
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
            <ul id="pagination__pages" class="pagination__list">
                <?php foreach ($pageNumbers as $pageNumber): ?>
                    <li>
                        <a href="<?= $baseRoute ?>/<?= $pageNumber ?>"
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
            <a href="<?= $baseRoute ?>/<?= $nextPage ?>"
                onclick="return false;"
                id="pagination__next"
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
            <a href="<?= $baseRoute ?>/<?= $totalPages ?>"
                onclick="return false;"
                id="pagination__last"
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
