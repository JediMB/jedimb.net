<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/datetime.utility.php';

use Exception;
use Utilities\DateTime;

if (!isset($createdOn) || !isset($modifiedOn))
    throw new Exception('Created/Modified Dates component requires createdOn and modifiedOn and variables');

$createdString = DateTime::ToString($createdOn);
 
?>

<span>
    <date-time server-time="<?= $createdString ?>" relative-date="true">
        <?=  $createdString ?>
    </date-time>
</span>

<?php if (!empty($modifiedOn)): ?>
    <?php $modifiedString = DateTime::ToString($modifiedOn) ?>
    <span class="weak">
        &ndash; Last modified 
        <date-time server-time="<?= $modifiedString ?>" relative-date="true">
            <?= $modifiedString ?>
        </date-time>.
    </span>
<?php endif ?>