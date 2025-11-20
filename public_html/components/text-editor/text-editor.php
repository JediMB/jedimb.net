<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Utilities\Component;

Component::renderCSS(__FILE__);
Component::addJSModule(__FILE__);

?>

<div>
    <fieldset>
        <select select-blocktype></select>
        <button btn-bold data-shortcut="B" data-tag="B"><b>B</b></button>
        <button btn-italics data-shortcut="I" data-tag="I"><i>I</i></button>
        <button btn-underline data-shortcut="U" data-tag="U"><u>U</u></button>
        <button btn-link
            data-text-query="Please input display text:"
            data-url-query="Please input link:">Link</button>
        <button btn-cleanup>Clean Up</button>
    </fieldset>
</div>
<text-box-wrapper>
    <text-box contenteditable><h2>Heading</h2><div>Text block 1</div><div>Text block 2</div><p>Paragraph</p></text-box>
</text-box-wrapper>

<html-output></html-output>
<key-info></key-info>