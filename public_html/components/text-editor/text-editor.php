<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Utilities\Component;

Component::renderCSS();
Component::addJSModule();

?>

<fieldset class="text-editor-toolbar">
    <select select-blocktype class="select-toolbar"></select>
    <button btn-bold
        data-shortcut="B"
        data-tag="B"
        title="Bold"
        class="btn-toolbar"
        >
        <svg xmlns="http://www.w3.org/2000/svg" height="1.25em" width="1.25em" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z"/>
    </svg>
    </button>
    <button btn-italics
        data-shortcut="I"
        data-tag="I"
        title="Italics"
        class="btn-toolbar"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z"/>
        </svg>
    </button>
    <button btn-underline
        data-shortcut="U"
        data-tag="U"
        title="Underline"
        class="btn-toolbar"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M200-120v-80h560v80H200Zm123-223q-56-63-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63q-101 0-157-63Z"/>
        </svg>
    </button>
    <button btn-link
        data-tag="A"
        data-text-query="Please input display text:"
        data-url-query="Please input link:"
        data-url-invalid="Invalid link. Please try again:"
        title="Link"
        class="btn-toolbar"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M680-160v-120H560v-80h120v-120h80v120h120v80H760v120h-80ZM440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm560-40h-80q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480Z"/>
        </svg>
    </button>
    <button modal-target="modal-images-<?= $cId ?>"
        title="Insert an image or gallery"
        class="btn-toolbar"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M120-200q-33 0-56.5-23.5T40-280v-400q0-33 23.5-56.5T120-760h400q33 0 56.5 23.5T600-680v400q0 33-23.5 56.5T520-200H120Zm600-320q-17 0-28.5-11.5T680-560v-160q0-17 11.5-28.5T720-760h160q17 0 28.5 11.5T920-720v160q0 17-11.5 28.5T880-520H720Zm40-80h80v-80h-80v80ZM120-280h400v-400H120v400Zm40-80h320L375-500l-75 100-55-73-85 113Zm560 160q-17 0-28.5-11.5T680-240v-160q0-17 11.5-28.5T720-440h160q17 0 28.5 11.5T920-400v160q0 17-11.5 28.5T880-200H720Zm40-80h80v-80h-80v80Zm-640 0v-400 400Zm640-320v-80 80Zm0 320v-80 80Z"/>
        </svg>
    </button>
    <button btn-pagebreak
        title="Insert page break for the content preview"
        class="btn-toolbar"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M240-80q-33 0-56.5-23.5T160-160v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-80H240Zm-80-440v-280q0-33 23.5-56.5T240-880h320l240 240v120h-80v-80H520v-200H240v280h-80Zm200 160v-80h240v80H360Zm320 0v-80h240v80H680Zm-640 0v-80h240v80H40Zm440-160Zm0 240Z"/>
        </svg>
    </button>
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
        aria-required="true"><div>Test<img-gallery gallery-id="1" aspect-ratio="16/9" auto-margin="left" width="50%" transition-time="2000" wait-time="2000"></img-gallery></div><hr page-break=""><div>Test<img-wrapper image-id="1"></img-wrapper></div></text-box>
    <options-panel>
        <panel-option>
            <button element-option="delete"
                title="Delete"
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-delete" href="#svg-delete"></use>
                </svg>
            </button>
        </panel-option>
        <panel-option>
            <button element-option="aspect-ratio"
                title="Change aspect ratio"
                >
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-aspect-ratio" href="#svg-aspect-ratio"></use>
                </svg>
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
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-width" href="#svg-width"></use>
                </svg>
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
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-height" href="#svg-height"></use>
                </svg>
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
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-timer-active" href="#svg-timer-active"></use>
                </svg>
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
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-timer-paused" href="#svg-timer-paused"></use>
                </svg>
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
                <svg width="1em" height="1em">
                    <use xlink:href="#svg-fit-screen" href="#svg-fit-screen"></use>
                </svg>
            </button>
            <form hidden>
                <input id="text-editor__option-fullscreen-<?= $cId ?>"
                    type="checkbox"
                    title="Click image to view in fullscreen"
                    name="doesFullscreen"
                    onchange="this.form.requestSubmit();">
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