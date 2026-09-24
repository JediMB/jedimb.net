<?php declare(strict_types=1);

namespace Database;

require_once 'models/db/page.db.model.php';

use Exception;
use PDOException;
use Models\DB\Page;
use Abstract\BaseDbService;

class PageDbService extends BaseDbService {
    public function getPage(int $id) : Page|false {
        try {
            $page = $this->dbService->selectById('page', $id);

            if ($page)
                return new Page($page);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
        
        return false;
    }
}