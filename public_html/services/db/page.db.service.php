<?php declare(strict_types=1);

namespace Services\DB;

require_once 'models/db/page.db.model.php';
require_once 'services/base/base.db.service.php';

use Exception;
use PDOException;
use Models\DB\Page;
use Services\Base\BaseDBService;

class PageDBService extends BaseDBService {
    public function getPage(int $id) : Page|false {
        try {
            $page = $this->dbService->selectById(
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