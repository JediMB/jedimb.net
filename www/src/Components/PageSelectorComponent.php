<?php declare(strict_types=1);

namespace App\Components;

use App\Abstract\Component;
use App\Models\App\Pagination;

class PageSelectorComponent extends Component {
    public readonly string $csv;
    public readonly int $currentPage;
    public readonly int $nextPage;
    /** @var (array<int, int>) $pageNumbers */
    public readonly array $pageNumbers;
    public readonly int $prevPage;
    public readonly int $totalPages;

    public function __construct(Pagination $pagination) {
        $this->csv = "$pagination";

        $currentPage = $pagination->page;
        $totalPages = $pagination->pageCount;

        $this->currentPage = $currentPage;
        $this->totalPages = $totalPages;
        $this->nextPage = min($totalPages, $currentPage + 1);
        $this->prevPage = max(1, $currentPage - 1);

        $pageNumbers = [ $currentPage => $currentPage ];
        $pageCount = 1;
        $pageSteps = 1;

        while ($pageCount < 5 && $pageSteps < 5) {
            $prev = max($currentPage - $pageSteps, 1);
            $pageNumbers[$prev] = $prev;

            $next = min($currentPage + $pageSteps, $totalPages);
            $pageNumbers[$next] = $next;

            $newCount = count($pageNumbers);
            if ($newCount === $pageCount)
                break;

            $pageCount = $newCount;
            $pageSteps++;
        }

        ksort($pageNumbers);
        $this->pageNumbers = $pageNumbers;

        return parent::__construct();
    }
}
