<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/datetime.utility.php';

use Exception;
use Utilities\Component;
use Utilities\DateTime;

/** @var bool $relativeDate */

if (empty($createdOn))
    throw new Exception('Created/Modified Dates component requires createdOn variable');

$relativeDate ??= false;
if (!is_bool($relativeDate))
    throw new Exception('Non-boolean value provided for relativeDate variable');

Component::noContainer();

$createdString = DateTime::toString($createdOn);
$relativeDateString = $relativeDate ? 'true' : 'false';

?>

<span>
    <date-time class="created-on"
        date-string="<?= $createdString ?>"
        relative-date="<?= $relativeDateString ?>"
        >
        <?=  $createdString ?>
    </date-time>
</span>

<?php if (!empty($modifiedOn)): ?>
    <?php $modifiedString = DateTime::toString($modifiedOn) ?>
    <span class="weak">
        &ndash; Last modified 
        <date-time class="modified-on"
            date-string="<?= $modifiedString ?>"
            relative-date="<?= $relativeDateString ?>"
            >
            <?= $modifiedString ?>
        </date-time>.
    </span>
<?php endif ?>