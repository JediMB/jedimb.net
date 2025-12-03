<?php declare(strict_types=1);

namespace Components;

use Exception;

if (!isset($createdOn) || !isset($modifiedOn))
    throw new Exception('Created/Modified Dates component requires createdOn and modifiedOn and variables');

// TODO: Should be using 'Y-m-d H:i:s O' formatting for GMT-relative timezone
// Also make sure that this change doesn't break frontend JS
$createdString = $createdOn->format('Y-m-d H:i:s');
 
?>

<span>
    <date-time server-time="<?= $createdString ?>" class="capitalize">
        <?= $createdString ?>
    </date-time>
</span>

<?php if (!empty($modifiedOn)): ?>
    <?php $modifiedString = $modifiedOn->format('Y-m-d H:i:s') ?>
    <span class="weak">
        – Last modified 
        <date-time server-time="<?= $modifiedString ?>">
            <?= $modifiedString ?>
        </date-time>.
    </span>
<?php endif ?>