<?php

namespace Services;

require_once 'services/singleton.php';

use Models\PageNavigationData;
use PDOException;

class NavigationService extends Singleton{
    public array $virtualPageRoutes;

    protected function __construct() {
        $navData = $this->getPageNavigationData();
        
        $this->virtualPageRoutes = $this->buildVirtualPageRoutes($navData);
        $this->buildMenuData($navData);
    }

    private function getPageNavigationData() : array {
        try {
            $paths = DatabaseService::getInstance()->selectView(
                'page_navigation_data'
            );
        }
        catch (PDOException $e) {
            $paths = [];
        }
        finally {
            $newPaths = []; 

            foreach ($paths as $path) {
                $path = new PageNavigationData($path);
                $newPaths[$path->id] = $path;
            }

            return $newPaths;
        }
    }

    private function buildVirtualPageRoutes(array $navData) : array {
        $routes = [];
       
        foreach ($navData as $item) {
            /** @var PageNavigationData $item */
            $id = $item->id;
            $fullPath = $item->pathPart;

            while ($item->parentId) {
                $item = $navData[$item->parentId];
                $fullPath = $item->pathPart . DIRECTORY_SEPARATOR . $fullPath;
            }

            $routes[$id] = $fullPath;
        }

        return $routes;
    }

    private function buildMenuData(array $virtualPageNavData) {
        $this->buildVirtualPageMenuData();
        $this->buildRealPageMenuData();
    }

    private function buildVirtualPageMenuData() {

    }

    private function buildRealPageMenuData() {

    }
}

?>