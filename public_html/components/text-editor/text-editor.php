<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Utilities\Component;

Component::renderCSS(__FILE__);
Component::addJSModule(__FILE__);

?>

<div>
    <button btn-bold><b>B</b></button>
    <button btn-italics><i>I</i></button>
    <button btn-h2><b>H2</b></button>
    <button btn-cleanup>Clean Up</button>
</div>
<text-box-wrapper>
    <text-box contenteditable><b><i>Bold and cursive</i><u>Bold and underscored</u></b></text-box>
</text-box-wrapper>

<html-output></html-output>