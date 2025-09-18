<?php

namespace Services;

require_once 'services/singleton.php';

class NavigationService extends Singleton{
    public string $pageTitle;
    public string $pageTemplate;
    public string $pageYear;
    public string $pageContent;

    public array $pageRoutes;
    public string $pageId;

    protected function __construct() {
        $this->pageTitle = SITE_TITLE;
        $this->pageTemplate  = realpath('views/' . SITE_TEMPLATE);
        $this->pageYear = SITE_CREATEDYEAR;
        $this->pageContent = 'Page content';
    }

    public function buildRoutes(array $pagePaths) {
        $this->pageRoutes = [];
       
        foreach ($pagePaths as $path) {
            /** @var PagePath $path */
            $id = $path->id;
            $fullPath = $path->pathPart;

            while ($path->parentId) {
                $path = $pagePaths[$path->parentId];
                $fullPath = $path->pathPart . DIRECTORY_SEPARATOR . $fullPath;
            }

            $this->pageRoutes[$id] = $fullPath;
        }
    }

    function setPageTitle(string $pageTitle) {
        $this->pageTitle = $pageTitle . ' – ' . SITE_TITLE;
    }
}

?>