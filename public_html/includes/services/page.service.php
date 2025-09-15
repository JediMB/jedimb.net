<?php

namespace Services;

require_once 'includes/services/singleton.php';
require_once 'includes/services/database-service.php';
require_once 'includes/models/page.php';

use Exception;
use Models\Page;

class PageService extends Singleton {
    public function getPage(int $id) : Page|false {
        try {
            $page = DatabaseService::getInstance()->selectById(
                'page', $id
            );
        }
        catch (Exception $e) {
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