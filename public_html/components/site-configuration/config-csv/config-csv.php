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
Component::renderCSS(__FILE__);
Component::addJSModule(__FILE__);

$initialValue = $isDefault ? $default : $value;

?>


<input type="hidden" name="<?= $id ?>-id" id="<?= $id ?>-id" value="<?= $dbId ?>">
<label for="<?= $id ?>"><?= $label ?></label>
<input-container>
    <input type="hidden" name="<?= $id ?>" id="<?= $id ?>"
        value="<?= $initialValue ?>"
        data-constant="<?= $name ?>"
        data-input-value="<?= $value ?>"
        data-original-value="<?= $value ?>"
        data-default-value="<?= $default ?>"
        pattern="<?= trim(REGEX_INPUT['config-text'], '/') ?>" required>
    <ul>
        <?php foreach (explode(', ', $initialValue) as $key => $item): ?>
            <li>
                <size-adjuster data-value="<?= $item ?>">
                    <input type="text" id="<?= "$id-$key" ?>" placeholder="Type here"
                        value="<?= $item ?>" oninput="this.parentNode.dataset.value = this.value"
                        size="1"
                        pattern="<?= trim(REGEX_INPUT['config-item'], '/') ?>" required
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
                    <input type="text" id="<?= "$id-template" ?>" placeholder="Type here"
                        value="" oninput="this.parentNode.dataset.value = this.value"
                        size="1"
                        pattern="<?= trim(REGEX_INPUT['config-item'], '/') ?>" required
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
</input-container>