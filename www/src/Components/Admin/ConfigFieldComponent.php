<?php declare(strict_types=1);

namespace App\Components\Admin;

use Exception;
use InvalidArgumentException;
use App\Abstract\Component;
use App\Enums\ConfigType;
use App\Models\DB\Configuration;
use App\Services\ConfigurationService;

class ConfigFieldComponent extends Component {
    public readonly string $label;
    public readonly string $name;
    public readonly int $dbId;
    public readonly bool $isDefaultValue;
    public readonly string $defaultValue;
    public readonly string $value;
    /** @var string[] $values */
    public readonly ?array $values;
    public readonly ConfigType $configType;

    public function __construct(string $label, string $constantName) {
        if (empty($label))
            throw new Exception('Invalid label passed to ConfigFieldComponent');

        $this->label = $label;
        $this->name = $constantName;
        
        $configService = ConfigurationService::getInstance();
        $config = $configService->getConfiguration($constantName);
        $default = $configService->getDefault($constantName);

        $this->dbId = $config?->id ?? 0;
        $this->isDefaultValue = $config?->isInactive ?? true;
        $this->defaultValue = "$default";
        $this->value = $config?->value ?? "$default";
        $this->configType = $config?->configType ?? ConfigurationService::$CONFIGURABLE_CONSTANTS[$constantName];

        if ($this->configType === ConfigType::CSV)
            $this->values = explode(', ', $this->value);

        return parent::__construct();
    }
}
