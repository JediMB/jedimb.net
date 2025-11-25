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
        <button btn-link data-tag="A"
            data-text-query="Please input display text:"
            data-url-query="Please input link:"
            data-url-invalid="Invalid link. Please try again:">Link</button>
        <button btn-cleanup>Clean Up</button>
    </fieldset>
</div>
<label>
    <input type="checkbox" checkbox-html>
    Edit HTML
</label>
<text-box-wrapper>
    <text-box contenteditable><div>Text block 1</div><h3>Heading</h3><div>Text block 2</div><p>Paragraph</p></text-box>
</text-box-wrapper>
<textarea html-editor class="hidden">Test</textarea>

<html-output></html-output>
<key-info></key-info>