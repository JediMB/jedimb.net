<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/datetime.utility.php';

use Exception;
use Utilities\Component;
use Utilities\DateTime;

if (empty($createdOn))
    throw new Exception('Created/Modified Dates component requires createdOn variable');

Component::noContainer();

$createdString = DateTime::toString($createdOn);
$relativeDate = empty($relativeDate) ? 'false' : 'true';
 
?>

<span>
    <date-time server-time="<?= $createdString ?>" relative-date="<?= $relativeDate ?>">
        <?=  $createdString ?>
    </date-time>
</span>

<?php if (!empty($modifiedOn)): ?>
    <?php $modifiedString = DateTime::toString($modifiedOn) ?>
    <span class="weak">
        &ndash; Last modified 
        <date-time server-time="<?= $modifiedString ?>" relative-date="<?= $relativeDate ?>">
            <?= $modifiedString ?>
        </date-time>.
    </span>
<?php endif ?>