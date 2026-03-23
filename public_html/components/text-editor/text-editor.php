<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Utilities\Component;

Component::renderCSS();
Component::addJSModule();

?>

<fieldset class="text-editor__toolbar">
    <select select-blocktype class="select-toolbar"></select>

    <div class="text-editor__toolbar-group">
        <button btn-bold
            data-shortcut="B"
            data-tag="B"
            title="Bold"
            class="btn-toolbar"
            >
            <svg width="1.25em" height="1.25em">
                <use xlink:href="#svg-text-bold" href="#svg-text-bold"></use>
            </svg>
        </button>
        <button btn-italics
            data-shortcut="I"
            data-tag="I"
            title="Italics"
            class="btn-toolbar"
            >
            <svg width="1.25em" height="1.25em">
                <use xlink:href="#svg-text-italics" href="#svg-text-italics"></use>
            </svg>
        </button>
        <button btn-underline
            data-shortcut="U"
            data-tag="U"
            title="Underline"
            class="btn-toolbar"
            >
            <svg width="1.25em" height="1.25em">
                <use xlink:href="#svg-text-underline" href="#svg-text-underline"></use>
            </svg>
        </button>
    </div>

    <div class="text-editor__toolbar-group">
        <button btn-link
            data-tag="A"
            data-text-query="Please input display text:"
            data-url-query="Please input link:"
            data-url-invalid="Invalid link. Please try again:"
            title="Link"
            class="btn-toolbar"
            >
            <svg width="1.25em" height="1.25em">
                <use xlink:href="#svg-link-add" href="#svg-link-add"></use>
            </svg>
        </button>
    </div>
    
    <div class="text-editor__toolbar-group">
        <button btn-align-left
            data-block-attribute="text-left"
            title="Text align left"
            class="btn-toolbar"
            >
            <svg width="1.25em" height="1.25em">
                <use xlink:href="#svg-text-align-left" href="#svg-text-align-left"></use>
            </svg>
        </button>
        <button btn-align-center
            data-block-attribute="text-center"
            title="Text align center"
            class="btn-toolbar"
            >
            <svg width="1.25em" height="1.25em">
                <use xlink:href="#svg-text-align-center" href="#svg-text-align-center"></use>
            </svg>
        </button>
        <button btn-align-right
            data-block-attribute="text-right"
            title="Text align right"
            class="btn-toolbar"
            >
            <svg width="1.25em" height="1.25em">
                <use xlink:href="#svg-text-align-right" href="#svg-text-align-right"></use>
            </svg>
        </button>
        <button btn-align-justify
            data-block-attribute="text-justify"
            title="Text align justify"
            class="btn-toolbar"
            >
            <svg width="1.25em" height="1.25em">
                <use xlink:href="#svg-text-align-justify" href="#svg-text-align-justify"></use>
            </svg>
        </button>
    </div>
    
    <div class="text-editor__toolbar-group">
        <button modal-target="modal-images-<?= $cId ?>"
            title="Insert an image or gallery"
            class="btn-toolbar"
            >
            <svg width="1.25em" height="1.25em">
                <use xlink:href="#svg-image-gallery" href="#svg-image-gallery"></use>
            </svg>
        </button>
        <button btn-pagebreak
            title="Insert page break for the content preview"
            class="btn-toolbar"
            >
            <svg width="1.25em" height="1.25em">
                <use xlink:href="#svg-page-break" href="#svg-page-break"></use>
            </svg>
        </button>
    </div>
</fieldset>
<label>
    <input type="checkbox" checkbox-html>
    Edit HTML
</label>

<text-box-container>
    <text-box id="text-box-<?= $cId ?>"
        contenteditable
        role="textbox"
        placeholder="What do you want to say?"
        aria-placeholder="What do you want to say?"
        aria-multiline="true"
        aria-required="true"
        ><div>Test<img-gallery gallery-id="1" aspect-ratio="16/9" auto-margin="left" width="50%" transition-time="2000ms" wait-time="2000ms"></img-gallery></div><hr page-break=""><div>Test<img-wrapper image-id="1"></img-wrapper></div></text-box>

    <options-panel>
        <panel-option>
            <button element-option="delete"
                title="Delete"
                >
                <svg width="1.25em" height="1.25em">
                    <use xlink:href="#svg-delete" href="#svg-delete"></use>
                </svg>
                Delete
            </button>
        </panel-option>
        <panel-option>
            <button element-option="aspect-ratio"
                title="Change aspect ratio"
                >
                <svg width="1.25em" height="1.25em">
                    <use xlink:href="#svg-aspect-ratio" href="#svg-aspect-ratio"></use>
                </svg>
                Aspect ratio
            </button>
            <form hidden>
                <input type="text"
                    name="aspectRatio"
                    title="Aspect ratio"
                    placeholder="1, 4/3, 16/9, etc.">
            </form>
        </panel-option>
        <panel-option>
            <button element-option="width"
                title="Width"
                >
                <svg width="1.25em" height="1.25em">
                    <use xlink:href="#svg-width" href="#svg-width"></use>
                </svg>
                Width
            </button>
            <form hidden>
                <input type="number" name="width" title="Width">
                <select name="unit" title="Width unit">
                    <option value="px">px</option>
                    <option value="%">%</option>
                </select>
            </form>
        </panel-option>
        <panel-option>
            <button element-option="height"
                title="Height"
                >
                <svg width="1.25em" height="1.25em">
                    <use xlink:href="#svg-height" href="#svg-height"></use>
                </svg>
                Height
            </button>
            <form hidden>
                <input type="number" name="height" title="Height">
                <select name="unit" title="Height unit">
                    <option value="px">px</option>
                    <option value="%">%</option>
                </select>
            </form>
        </panel-option>
        <panel-option>
            <button element-option="transition-time"
                title="Transition time"
                >
                <svg width="1.25em" height="1.25em">
                    <use xlink:href="#svg-timer-active" href="#svg-timer-active"></use>
                </svg>
                Transition
            </button>
            <form hidden>
                <input type="number" name="time" title="Transition time">
                <select name="unit" title="Time unit">
                    <option value="ms">ms</option>
                    <option value="s">s</option>
                </select>
            </form>
        </panel-option>
        <panel-option>
            <button element-option="wait-time"
                title="Wait time"
                >
                <svg width="1.25em" height="1.25em">
                    <use xlink:href="#svg-timer-paused" href="#svg-timer-paused"></use>
                </svg>
                Wait
            </button>
            <form hidden>
                <input type="number" name="time" title="Wait time">
                <select name="unit" title="Time unit">
                    <option value="ms">ms</option>
                    <option value="s">s</option>
                </select>
            </form>
        </panel-option>
        <panel-option>
            <button element-option="fullscreen-click"
                title="Fullscreen click"
                >
                <svg width="1.25em" height="1.25em">
                    <use xlink:href="#svg-fit-screen" href="#svg-fit-screen"></use>
                </svg>
                Click to fullscreen
            </button>
            <form hidden>
                <input id="text-editor__option-fullscreen-<?= $cId ?>"
                    type="checkbox"
                    title="Click image to view in fullscreen"
                    name="doesFullscreen">
            </form>
        </panel-option>
    </options-panel>
</text-box-container>
<textarea html-editor hidden>Test</textarea>

<?php Component::include('modal-popup', [
    'attributes' => [ 'id' => "modal-images-$cId" ],
    'include' => 'image-gallery',
    'includeVariables' => [ 'insertTarget' => "text-box-$cId" ]
]) ?>