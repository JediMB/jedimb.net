<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Utilities\Component;

Component::renderCSS(__FILE__);
Component::queueJS(__FILE__);

?>