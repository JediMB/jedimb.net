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
                        title="Whole positive numbers only"
                    <?php break;
                    default: ?>
                        type="text"
                        pattern="<?= REGEX_HTML['default-text'] ?>"
                        title="<?= TEXT_CONFIG_CHARS ?>"
                        data-error-pattern-mismatch="<?= TEXT_CONFIG_CHARS ?>"
                    <?php break ?>
                <?php endswitch ?>
                data-error-value-missing="Field can't be empty"
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
        <?php if ($data->values): ?>
            <ul class="flex-row">
                <?php foreach ($data->values as $key => $item): ?>
                    <li>
                        <input
                            type="text"
                            title="<?= TEXT_CONFIG_ITEM_CHARS ?>"
                            placeholder="Type here..."
                            value="<?= $item ?>"
                            size="<?= strlen($item) ?>"
                            pattern="<?= TEXT_CONFIG_ITEM_CHARS ?>"
                            required
                            >
                    </li>
                <?php endforeach ?>
            </ul>
        <?php endif ?>
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
