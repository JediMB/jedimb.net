<?php declare(strict_types=1);

namespace App\Components\Admin;

use App\Abstract\Component;
use App\Services\ConfigurationService;

class SiteConfigurationComponent extends Component {
    /** @var (array{label: string, name: string}[]) */
    public readonly array $constants;

    public function __construct() {

        $this->constants = array_map(function($constantName) {
            return [
                'label' => ucwords(strtolower(str_replace('_', ' ', $constantName))),
                'name' => $constantName
            ];
        }, array_keys(ConfigurationService::$CONFIGURABLE_CONSTANTS));

        return parent::__construct();
    }
}
