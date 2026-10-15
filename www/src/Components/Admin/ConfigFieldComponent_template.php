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
        <input-container>
            <input
                id="config-field__input-<?= $data->uid ?>"
                name="<?= $data->name ?>"
                <?php switch ($data->configType):
                    case ConfigType::Number: ?>
                        type="number"
                        min="1"
                    <?php break;
                    default: ?>
                        type="text"
                        pattern="<?= REGEX_HTML['default-text'] ?>"
                        title="<?= TEXT_CONFIG_CHARS ?>"
                    <?php break ?>
                <?php endswitch ?>
                value="<?= $data->value ?>"
                placeholder="<?= $data->label ?>"
                <?php if ($data->isDefaultValue): ?>
                    disabled
                <?php endif ?>
                required
            >
            <button type="button">
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-restore" href="#svg-restore"></use>
                </svg>
            </button>
        </input-container>
    </div>
    <label for="config-field__toggle-<?= $data->uid ?>">
        <input
            id="config-field__toggle-<?= $data->uid ?>"
            name=""
            type="checkbox"
            <?php if ($data->isDefaultValue): ?>
                checked
            <?php endif ?>
            >
        Use default
    </label>
</config-field-component>
