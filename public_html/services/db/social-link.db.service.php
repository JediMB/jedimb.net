<?php declare(strict_types=1);

namespace Services\DB;

require_once 'models/db/social-link.db.model.php';
require_once 'services/base/base.db.service.php';

use PDOException;
use Exception;
use Models\DB\SocialLink;
use Services\Base\BaseDBService;

class SocialLinkDBService extends BaseDBService {
    protected function __construct() {
        parent::__construct();
    }

    public function getSocialLinks() : array {
        try {
            $links = $this->dbService->selectView('social_link', orderBy: 'order');

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