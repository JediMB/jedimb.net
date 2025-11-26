<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Utilities\Component;

Component::renderOnce();
Component::renderCSS();
Component::addJSModule();

?>

<button type="button" btn-add class="btn btn-add">
    <svg id="svg-blog-add" width="2em" height="2em" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
</button>

<input type="text" placeholder="Title">
<input type="url" placeholder="Facebook link">
<?php Component::include('text-editor')  ?>