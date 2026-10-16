<?php declare(strict_types=1);

use App\Components\Admin\ConfigFieldComponent;
use App\Enums\ConfigType;

/** @var ConfigFieldComponent $data */

$uid = $data->uid;

?>

<config-field-component class="flex-col">
    <label for="config-field__input-<?= $uid ?>">
        <?= $data->label ?>:
    </label>
    <input-row class="flex-row">
        <input input-config
            id="config-field__input-<?= $data->uid ?>"
            class="flex-grow"
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
            <?php elseif ($data->values): ?>
                hidden
            <?php endif ?>
            required
        >
        <?php if ($data->values): ?>
            <ul list-csv
                <?php if ($data->isDefaultValue): ?>
                    hidden
                <?php endif ?>
                class="flex-row flex-grow"
                >
                <?php foreach ($data->values as $key => $item): ?>
                    <li>
                        <input input-csv
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
        <button btn-save
            type="button"
            data-enabled-title="Save changes"
            data-disabled-title="No changes to save"
            title="No changes to save"
            class="btn-secondary btn-safe"
            disabled
            >
            <svg width="1em" height="1em">
                <use xlink:href="#svg-check" href="#svg-check"></use>
            </svg>
        </button>
        <button btn-undo
            type="button"
            data-enabled-title="Undo changes"
            data-disabled-title="No changes to undo"
            title="No changes to undo"
            class="btn-secondary btn-attention"
            disabled
            >
            <svg width="1em" height="1em">
                <use xlink:href="#svg-restore" href="#svg-restore"></use>
            </svg>
        </button>
    </input-row>
    <label for="config-field__toggle-<?= $data->uid ?>">
        <input toggle-default
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
