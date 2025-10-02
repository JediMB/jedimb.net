<?php declare(strict_types=1);

namespace Services\DB;

require_once 'enums/db-fetch.enum.php';
require_once 'models/db/social-link.db.model.php';
require_once 'services/base/singleton.php';
require_once 'services/db/database.service.php';

use PDOException;
use Enums\DBFetch;
use Models\DB\SocialLink;
use Services\Base\Singleton;

class SocialLinkDBService extends Singleton {
    public function getSocialLinks() : array {
        try {
            $service = DatabaseService::getInstance(); /** @var DatabaseService $service */
            $links = $service->selectView('social_link', DBFetch::All);
        }
        catch (PDOException $e) {
            $links = [];
        }
        finally {
            return array_map(function($link) {
                return new SocialLink($link);
            }, $links);
        }
    }
}

?>