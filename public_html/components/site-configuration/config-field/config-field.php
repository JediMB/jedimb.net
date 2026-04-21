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
    throw new Exception("Config Field component missing variables: $missingArgs");
}

if (empty($config)) {
    $dbId = 0;
    $value = $default;
    $isDefault = true;
}
else { /** @var \Models\DB\Configuration $config */
    $dbId = $config->id;
    $value = $config->valueInt ?? $config->valueString;
    $isDefault = !$config->isActive;
}

$isInt = is_int($value);

Component::hide();
Component::renderCSS();
Component::addJSModule();

?>

<input type="hidden" name="<?= $id ?>-id" id="<?= $id ?>-id" value="<?= $dbId ?>">
<label for="<?= $id ?>"><?= $label ?></label>
<input-container>
    <input type="<?= $isInt ? 'number' : 'text' ?>"
        config-field
        id="<?= $id ?>"
        name="<?= $id ?>"
        placeholder="<?= $label ?>"
        value="<?= $isDefault ? $default : $value ?>"
        data-constant="<?= $name ?>"
        data-input-value="<?= $value ?>"
        data-original-value="<?= $isDefault ? '' : $value ?>"
        data-default-value="<?= $default ?>"
        <?php if ($isInt): ?>
            min="1"
        <?php else: ?>
            pattern="<?= REGEX_HTML['default-text'] ?>"
            data-error-pattern-mismatch="<?= TEXT_CONFIG_CHARS ?>"
        <?php endif ?>
        data-error-value-missing="Field can't be empty"
        title="<?= TEXT_CONFIG_CHARS ?>"
        <?= $isDefault ? 'disabled' : null ?>
        required>
    <button type="button" restore-input class="hidden">
        <svg width="100%" height="100%">
            <use xlink:href="#svg-restore" href="#svg-restore"></use>
        </svg>
    </button>
</input-container>
<div input-errors></div>
<label>
    <input type="checkbox" name="<?= $id ?>-is-default" id="<?= $id ?>-is-default"
        <?= $isDefault ? 'checked' : null ?> data-original-value="<?= $isDefault ?>">
    <?= PAGE_ADMIN_USEDEFAULT ?>
</label>