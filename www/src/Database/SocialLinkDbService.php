<?php declare(strict_types=1);

namespace App\Database;

use Exception;
use PDOException;
use App\Abstract\BaseDbService;
use App\Enums\Visibility;
use App\Models\DB\SocialLink;

class SocialLinkDbService extends BaseDbService {
    protected function __construct() {
        parent::__construct();
    }

    /** @return SocialLink[] */
    public function getSocialLinks(Visibility $visibility = Visibility::Visible) : array {
        try {
            $columnValues = [];

            if ($visibility !== Visibility::Any)
                $columnValues['is_hidden'] = $visibility === Visibility::Hidden;

            $links = $this->dbService->selectView(
                view: 'social_link',
                columnValues: $columnValues,
                orderBy: [ [ 'name' => 'order'] ]
            );

            return array_map(function($link) {
                return new SocialLink($link);
            }, $links);
        }
        catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}