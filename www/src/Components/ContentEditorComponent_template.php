<?php declare(strict_types=1);

use App\Components\ContentEditorComponent;
use App\Utils\CSSRenderer;

/** @var ContentEditorComponent $data */
/** @var string $baseClass */
/** @var string $baseId */

?>

<content-editor-component>
    
</content-editor-component>

<?php CSSRenderer::add($baseClass, <<<CSS
    .{$baseClass} {

    }
CSS) ?>
