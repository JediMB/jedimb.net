<?php declare(strict_types=1);

namespace Models;

class Pagination {
    public readonly int $page;
    public readonly int $pageSize;
    public readonly int $offset;
    public readonly int $total;

    public function __construct(int $page, int $pageSize, int $offset, int $total) {
        $this->page = $page;
        $this->pageSize = $pageSize;
        $this->offset = $offset;
        $this->total = $total;
    }
}

?>
