<?php declare(strict_types=1);

namespace Database;

use Exception;
use PDOException;
use Abstract\BaseDbService;
use Models\DB\SocialLink;

class SocialLinkDbService extends BaseDbService {
    protected function __construct() {
        parent::__construct();
    }

    public function getSocialLinks() : array {
        try {
            $links = $this->dbService->selectView('social_link', orderBy: [ [ 'name' => 'order'] ]);

            return array_map(function($link) {
                return new SocialLink($link);
            }, $links);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}