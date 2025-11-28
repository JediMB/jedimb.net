<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Utilities\Component;

if (empty($include)) {
    echo 'ERROR: No sub-component provided for modal-popup.';
    return;
}

//Component::hide();
Component::renderCSS();
Component::addJSModule();


?>

<modal-popup>
    <modal-popup-content>
        <?php Component::include($include) ?>
    </modal-popup-content>
</modal-popup>