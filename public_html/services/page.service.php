<?php

namespace Services;

require_once 'services/singleton.php';
require_once 'services/database.service.php';
require_once 'models/page.php';
require_once 'models/page-path.php';

use Models\Page;
use Models\PagePath;
use PDOException;

class PageService extends Singleton {
    public function getPagePaths() : array {
        try {
            $paths = DatabaseService::getInstance()->selectView(
                'page_paths_visible'
            );
        }
        catch (PDOException $e) {
            $paths = [];
        }
        finally {
            $newPaths = []; 

            foreach ($paths as $path) {
                $path = new PagePath($path);
                $newPaths[$path->id] = $path;
            }

            return $newPaths;
        }
    }

    public function getPage(int $id) : Page|false {
        try {
            $page = DatabaseService::getInstance()->selectById(
                'page', $id
            );
        }
        catch (PDOException $e) {
            $page['id'] = $id;
            $page['title'] = 'Error';
            $page['content'] = $e->getMessage();
        }
        finally {
            if ($page)
                return new Page($page);

            return false;
        }
    }
}

?>