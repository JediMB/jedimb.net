<?php declare(strict_types=1);

namespace Components;

use Utils\Component;

if (empty($include)) {
    echo 'ERROR: No sub-component provided for modal-popup.';
    return;
}

Component::hide();
Component::renderCSS();
Component::addJSModule();

?>

<modal-popup>
    <modal-popup-content>
        <?php Component::include($include, [
            'attributes' => $includeAttributes + [ 'finish-event' => 'closemodal' ],
            ] + $includeVariables) ?>
    </modal-popup-content>
</modal-popup>