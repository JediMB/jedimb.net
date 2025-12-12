<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Utilities\Component;

Component::renderCSS();
Component::addJSModule();

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
        <button modal-target="images">Images</button>
        <button btn-cleanup>Clean Up</button>
    </fieldset>
</div>
<label>
    <input type="checkbox" checkbox-html>
    Edit HTML
</label>
<text-box-wrapper>
    <text-box contenteditable><div>Text block 1</div><h3>Heading</h3><div>Text block 2</div><div><img src="/images/gallery/20251203_112141_91aa.png" data-image-id="3"></div><p>Paragraph</p></text-box>
</text-box-wrapper>
<textarea html-editor class="hidden">Test</textarea>

<html-output></html-output>
<key-info></key-info>

<?php Component::include('modal-popup', [
    'attributes' => [ 'modal-name' => 'images' ],
    'include' => 'image-manager'
]) ?>