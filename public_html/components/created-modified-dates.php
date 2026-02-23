<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/datetime.utility.php';

use Exception;
use Utilities\DateTime;

if (empty($createdOn))
    throw new Exception('Created/Modified Dates component requires createdOn variable');

$createdString = DateTime::toString($createdOn);
 
?>

<span>
    <date-time server-time="<?= $createdString ?>" relative-date="true">
        <?=  $createdString ?>
    </date-time>
</span>

<?php if (!empty($modifiedOn)): ?>
    <?php $modifiedString = DateTime::toString($modifiedOn) ?>
    <span class="weak">
        &ndash; Last modified 
        <date-time server-time="<?= $modifiedString ?>" relative-date="true">
            <?= $modifiedString ?>
        </date-time>.
    </span>
<?php endif ?>