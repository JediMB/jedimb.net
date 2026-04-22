<?php declare(strict_types=1);

namespace Components\Admin;

require_once 'utilities/component.utility.php';

use Utilities\Component;

Component::renderOnce();
Component::renderCSS();
Component::addJSModule();

?>

<form id="posts-settings">
    <fieldset>
        <h3 class="h3">Posts</h3>
    </fieldset>
</form>