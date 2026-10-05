<?php declare(strict_types=1);

namespace App\Services;

use App\Abstract\Singleton;
use App\Database\SocialLinkDbService;
use App\Enums\Visibility;
use App\Models\DB\SocialLink;

class SocialLinkService extends Singleton {
    private SocialLinkDbService $socialLinkDbService;

    protected function __construct() {
        $this->socialLinkDbService = SocialLinkDbService::getInstance();
    }

    /** @return SocialLink[] */
    public function getAllSocialLinks() : array {
        return $this->socialLinkDbService->getSocialLinks(Visibility::Any);
    }

    /** @return SocialLink[] */
    public function getHiddenSocialLinks() : array {
        return $this->socialLinkDbService->getSocialLinks(Visibility::Hidden);
    }

    /** @return SocialLink[] */
    public function getVisibleSocialLinks() : array {
        return $this->socialLinkDbService->getSocialLinks(Visibility::Visible);
    }
}

?>
