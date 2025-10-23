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
    $value = $config->value;
    $isDefault = !$config->isActive;
}

Component::renderCSS(__FILE__);
Component::addJSModule(__FILE__);

?>

<label for="<?= $id ?>"><?= $label ?></label>
<input type="text" name="<?= $id ?>" id="<?= $id ?>" placeholder="<?= $label ?>"
    value="<?= $value ?>"
    data-id="<?= $dbId ?>"
    data-constant="<?= $name ?>"
    data-input-value="<?= $value ?>"
    data-original-value="<?= $value ?>"
    data-default-value="<?= $default ?>"
    pattern="<?= trim(REGEX_INPUT['config-text'], '/') ?>" required
    data-error-value-missing="Field can't be empty"
    data-error-pattern-mismatch="<?= TEXT_CONFIG_CHARS ?>"
    title="<?= TEXT_CONFIG_CHARS ?>"
    <?= $isDefault ? 'disabled' : null ?>>
<div input-errors></div>
<label>
    <input type="checkbox" name="<?= $id ?>-is-default" id="<?= $id ?>-is-default"
        <?= $isDefault ? 'checked' : null ?> data-original-value="<?= $isDefault ?>">
    <?= PAGE_ADMIN_USEDEFAULT ?>
</label>