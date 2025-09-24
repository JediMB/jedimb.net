<?php declare(strict_types=1);

namespace Services;

require_once 'services/singleton.php';
require_once 'models/page-navigation-data.model.php';
require_once 'models/menu-item.model.php';

use Exception;
use Models\MenuItem;
use Models\PageNavigationData;
use PDOException;

class NavigationService extends Singleton{
    public array $virtualPageRoutes;
    public array $menu;

    protected function __construct() {
        $navData = $this->getPageNavigationData();

        $this->buildVirtualPageRoutes($navData);
        $this->buildVirtualPageMenuData($navData);
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

    private function buildVirtualPageRoutes(array $navData) {
        $routes = [];
       
        foreach ($navData as $item) {
            /** @var PageNavigationData $item */
            $id = $item->id;
            $fullPath = $item->pathPart;

            while ($item->parentId) {
                $item = $navData[$item->parentId];
                $fullPath = $item->pathPart . DIRECTORY_SEPARATOR . $fullPath;
            }

            $routes[$id] = "/$fullPath";
        }

        $this->virtualPageRoutes = $routes;
    }

    private function buildVirtualPageMenuData(array $navData) {
        if (!isset($this->virtualPageRoutes))
            throw new Exception('Virtual page routes not built before trying to build menu data.');

        $this->menu ??= [];
        $tier2Items = [];

        foreach ($navData as $item) {
            /** @var PageNavigationData $item */
         
            if ($item->parentId === null) {
                $this->menu[$item->id] = new MenuItem(
                    $item->menuTitle,
                    $this->virtualPageRoutes[$item->id]
                );
                continue;
            }

            if (isset($this->menu[$item->parentId])) {
                $this->menu[$item->parentId]->children[$item->id] =
                    $tier2Items[$item->id] = new MenuItem(
                        $item->menuTitle,
                        $this->virtualPageRoutes[$item->id]
                    );
                continue;
            }

            if (isset($tier2Items[$item->parentId])) {
                $tier2Items[$item->parentId]->children[$item->id] = new MenuItem(
                    $item->menuTitle,
                    $this->virtualPageRoutes[$item->id]
                );
            }
        }
    }
}

?>