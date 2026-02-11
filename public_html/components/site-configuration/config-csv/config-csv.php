<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Exception;
use Utilities\Component;

$missingArgs = [];
if (empty($id)) $missingArgs[] = 'id';
if (empty($label)) $missingArgs[] = 'label';
if (empty($name)) $missingArgs = 'name';
if (empty($default)) $missingArgs = 'default';

if (!empty($missingArgs)) {
    $missingArgs = implode(', ', $missingArgs);
    throw new Exception("Config CSV component missing variables: $missingArgs");
}

if (empty($config)) {
    $dbId = 0;
    $value = $default;
    $isDefault = true;
}
else { /** @var \Models\DB\Configuration $config */
    $dbId = $config->id;
    $value = $config->value;
    $isDefault = !$config->isActive;
}

Component::hide();
Component::renderCSS();
Component::addJSModule();

$initialValue = $isDefault ? $default : $value;

?>


<input type="hidden" config-id name="<?= $id ?>-id" id="<?= $id ?>-id" value="<?= $dbId ?>">
<label for="<?= $id ?>"><?= $label ?></label>
<default-value <?= $isDefault ? null : 'hidden' ?>><?= $default ?></default-value>
<input-container <?= $isDefault ? 'hidden' : null ?>>
    <fieldset>
        <input type="hidden" input-string name="<?= $id ?>" id="<?= $id ?>"
            value="<?= $initialValue ?>"
            data-constant="<?= $name ?>"
            data-original-value="<?= $value ?>"
            data-default-value="<?= $default ?>" <?php // removable? ?>
            pattern="<?= REGEX_JS['default-text'] ?>" required>
        <ul>
            <?php foreach (explode(', ', $initialValue) as $key => $item): ?>
                <li>
                    <size-adjuster data-value="<?= $item ?>">
                        <input type="text" text-item id="<?= "$id-$key" ?>" placeholder="Type here"
                            value="<?= $item ?>" oninput="this.parentNode.dataset.value = this.value"
                            size="1"
                            pattern="<?= REGEX_JS['config-item'] ?>" required
                            title="<?= TEXT_CONFIG_ITEM_CHARS ?>">
                    </size-adjuster>
                    <button type="button" btn-delete>
                        <svg width="100%" height="100%">
                            <use xlink:href="#svg-config-delete" href="#svg-config-delete"></use>
                        </svg>
                    </button>
                </li>
            <?php endforeach ?>
            <template>
                <li>
                    <size-adjuster data-value="Type here">
                        <input type="text" text-item id="<?= "$id-template" ?>" placeholder="Type here"
                            value="" oninput="this.parentNode.dataset.value = this.value"
                            size="1"
                            pattern="<?= REGEX_JS['config-item'] ?>" required
                            title="<?= TEXT_CONFIG_ITEM_CHARS ?>">
                    </size-adjuster>
                    <button type="button" btn-delete>
                        <svg width="100%" height="100%">
                            <use xlink:href="#svg-config-delete" href="#svg-config-delete"></use>
                        </svg>
                    </button>
                </li>
            </template>
        </ul>
        <button type="button" btn-add>
            <svg width="100%" height="100%">
                <use xlink:href="#svg-config-add" href="#svg-config-add"></use>
            </svg>
        </button>
    </fieldset>
</input-container>
<label>
    <input type="checkbox" default-toggle name="<?= $id ?>-is-default" id="<?= $id ?>-is-default"
        <?= $isDefault ? 'checked' : null ?> data-original-value="<?= $isDefault ?>">
    <?= PAGE_ADMIN_USEDEFAULT ?>
</label>