<?php declare(strict_types=1);

namespace Services;

require_once 'services/singleton.php';
require_once 'services/database.service.php';
require_once 'models/social-link.model.php';
require_once 'enums/db-fetch.enum.php';

use Enums\DBFetch;
use Models\SocialLink;
use PDOException;

class SocialLinkService extends Singleton {
    public function getSocialLinks() : array {
        try {
            $service = DatabaseService::getInstance();
            /** @var DatabaseService $service */

            $links = $service->selectView('social_link', DBFetch::All);
        }
        catch (PDOException $e) {
            $links = [];
        }
        finally {
            foreach ($links as &$link) {
                $link = new SocialLink($link);
            }

            return $links;
        }
    }
}

?>