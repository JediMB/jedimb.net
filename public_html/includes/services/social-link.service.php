<?php

require_once 'includes/services/singleton.php';
require_once 'includes/services/database-service.php';
require_once 'includes/models/social-link.php';

class SocialLinkService extends Singleton {
    public function getSocialLinks() : array {
        try {
            $service = DatabaseService::getInstance();
            /** @var DatabaseService $service */

            $links = $service->selectView('social_link', Fetch::All);
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