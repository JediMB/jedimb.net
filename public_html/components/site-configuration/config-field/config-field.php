<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Exception;
use Utilities\Component;

if (!isset($id) || !isset($label))
    throw new Exception('Config Field component requires id and label variables');

$input ??= null;

if (gettype($input) === 'string') {
    $value = $input;
    $default = true;
}
else { /** @var \Models\DB\Configuration $input */
    $value = $input->value;
    $default = !$input->isActive;
}

Component::renderCSS(__FILE__);
Component::queueJS(__FILE__);

?>

<config-field-container id="<?= $id ?>-container">
    <label for="site-title"><?= $label ?></label>
    <input type="text" name="<?= $id ?>" id="<?= $id ?>" placeholder="<?= $label ?>"
        value="<?= $value ?>" <?= $default ? 'disabled' : null ?>>
    <div input-errors></div>
    <label>
        <input type="checkbox" name="<?= $id ?>-is-default" id="<?= $id ?>-is-default"
            <?= $default ? 'checked' : null ?>>
        <?= PAGE_ADMIN_USEDEFAULT ?>
    </label>
</config-field-container>