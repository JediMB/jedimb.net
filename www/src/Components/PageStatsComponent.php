<?php declare(strict_types=1);

namespace App\Components;

use App\Abstract\Component;
use App\Models\App\Pagination;

class PageStatsComponent extends Component {
    public readonly string $collectionType;
    public readonly int $itemFirst;
    public readonly int $itemLast;
    public readonly int $itemsTotal;

    /** 
     * @param string $collectionType The plural noun for the type of items displayed, e.g. "posts"
     * @param non-negative-int $itemCount The number of items displayed on the current page
     * @param Pagination $paginationData 
     */
    public function __construct(string $collectionType, int $itemCount, Pagination $paginationData) {
        $this->collectionType = $collectionType;
        $this->itemFirst = $paginationData->offset + 1;
        $this->itemLast = $paginationData->offset + $itemCount;
        $this->itemsTotal = $paginationData->itemCount;

        return parent::__construct();
    }
}
