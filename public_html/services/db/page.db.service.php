<?php declare(strict_types=1);

namespace Services\DB;

require_once 'models/db/page.db.model.php';
require_once 'services/base/singleton.php';
require_once 'services/db/database.service.php';

use Exception;
use PDOException;
use Models\DB\Page;
use Services\Base\Singleton;

class PageDBService extends Singleton {
    public function getPage(int $id) : Page|false {
        try {
            $page = DatabaseService::getInstance()->selectById(
                'page', $id
            );

            if ($page)
                return new Page($page);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
        
        return false;
    }
}

?>