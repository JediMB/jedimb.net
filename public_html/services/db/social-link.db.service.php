<?php declare(strict_types=1);

namespace Services\DB;

require_once 'enums/db-fetch.enum.php';
require_once 'models/db/social-link.db.model.php';
require_once 'services/base/singleton.php';
require_once 'services/db/database.service.php';

use PDOException;
use Enums\DBFetch;
use Exception;
use Models\DB\SocialLink;
use Services\Base\Singleton;

class SocialLinkDBService extends Singleton {
    private DatabaseService $dbService;

    protected function __construct() {
        $this->dbService = DatabaseService::getInstance();
    }

    public function getSocialLinks() : array {
        try {
            $links = $this->dbService->selectView('social_link', DBFetch::All);

            return array_map(function($link) {
                return new SocialLink($link);
            }, $links);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}

?>