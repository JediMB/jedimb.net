<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Utilities\Component;

if (empty($include)) {
    echo 'ERROR: No sub-component provided for modal-popup.';
    return;
}

Component::hide();
Component::renderCSS(__FILE__);
Component::addJSModule(__FILE__);


?>

<modal-popup>
    <!-- BUG: Component within component means the hide()
        is applied to the sub-component instead of the current one -->
    <?php Component::include($include) ?>
</modal-popup>