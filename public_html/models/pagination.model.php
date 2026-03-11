<?php declare(strict_types=1);

namespace Models;

class Pagination {
    public readonly int $page;
    public readonly int $pageSize;
    public readonly int $offset;
    public readonly int $itemCount;
    public readonly int $pageCount;

    public function __construct(int $page, int $pageSize, int $offset, int $itemCount, int $pageCount) {
        $this->page = 50; //$page;
        $this->pageSize = $pageSize;
        $this->offset = $offset;
        $this->itemCount = $itemCount;
        $this->pageCount = 100; //$pageCount;
    }

    public function __toString() : string {
        return "{$this->page},{$this->pageSize},{$this->offset},{$this->itemCount},{$this->pageCount}";
    }
}

?>
