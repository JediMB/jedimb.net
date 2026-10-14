<?php declare(strict_types=1);

use App\Components\Admin\ConfigFieldComponent;
use App\Enums\ConfigType;

/** @var ConfigFieldComponent $data */

$uid = $data->uid;

?>

<config-field-component>
    <label for="config-field__input-<?= $uid ?>">
        <?= $data->label ?>:
    </label>
    <div>
        <input full-width id="config-field__input-<?= $data->uid ?>"
            type="<?= match ($data->configType) {
                ConfigType::Number => 'number',
                default => 'text',
            } ?>"
            value="<?= $data->value ?>"
        >
        <button>
            <svg width="1em" height="1em">
                <use xlink:href="#svg-restore" href="#svg-restore"></use>
            </svg>
        </button>
    </div>
    <label>
        <input type="checkbox" name="">
        Use default
    </label>
</config-field-component>
