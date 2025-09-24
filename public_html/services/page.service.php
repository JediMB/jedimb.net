<?php declare(strict_types=1);

namespace Services;

require_once 'services/singleton.php';
require_once 'services/database.service.php';
require_once 'models/page.model.php';

use Models\Page;
use PDOException;

class PageService extends Singleton {
    public function getPage(int $id) : Page|false {
        try {
            $page = DatabaseService::getInstance()->selectById(
                'page', $id
            );
        }
        catch (PDOException $e) {
            $page['id'] = $id;
            $page['page_title'] = 'Error';
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