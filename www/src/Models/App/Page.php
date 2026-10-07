<?php declare(strict_types=1);

namespace App\Models\App;

use App\Enums\PageType;
use DateTime;

class Page {
    public readonly PageType $pageType;
    public readonly string $baseRequest;
    public readonly int $pageNumber;
    public readonly ?string $realPath;
    public readonly string $header;

    public string $title = '';
    public string $content = '';
    public ?DateTime $createdOn = null;
    public ?DateTime $modifiedOn = null;

    public private(set) ?string $viewPath = null;

    public function __construct(PageType $pageType, string $baseRequest, int $pageNumber = 0, ?string $realPath = null) {
        switch ($pageType) {
            case PageType::NotFound:
                $this->pageType = PageType::PHP;
                $this->header = 'HTTP/1.1 404 Not Found';
                $this->realPath = realpath(PATH_ERROR404);
                break;

            case PageType::Forbidden:
                $this->pageType = PageType::PHP;
                $this->header = 'HTTP/1.1 403 Forbidden';
                $this->realPath = realpath(PATH_ERROR403);
                break;

            default:
                $this->pageType = $pageType;
                $this->header = 'HTTP/1.1 200 OK';
                $this->realPath = $realPath;
                break;
        }

        $this->baseRequest = $baseRequest;
        $this->pageNumber = $pageNumber;
    }

    /** Set the page view template if it has not already been set */
    public function setView(string $viewFile) {
        $this->viewPath ??= PATH_VIEW_DIR . "/$viewFile";
    }
}
