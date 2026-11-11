<?php declare(strict_types=1);

use App\Components\ContentEditorComponent;
use App\Utils\CSSRenderer;

/** @var ContentEditorComponent $data */
/** @var string $baseClass */
/** @var string $baseId */

?>

<content-editor-component>
    <content-container>
        <content-text>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum leo libero, vehicula a finibus non, lobortis sed augue. Duis nisi libero, faucibus a urna sit amet, faucibus placerat dolor. Quisque eu libero dolor. Duis aliquet vehicula semper. Ut vel rutrum nulla. Aenean posuere scelerisque arcu eu molestie. Aenean sit amet augue ipsum. Sed non dictum magna. Proin aliquet odio erat, sed interdum lectus convallis in. Suspendisse ullamcorper leo sit amet est fermentum, vitae semper massa eleifend. Nulla facilisi.</p>
            <p>Suspendisse at orci sit amet ante facilisis aliquam. Donec tellus eros, posuere at ante in, scelerisque vulputate lorem. Curabitur et dignissim ex. Maecenas varius ornare turpis ut dapibus. Sed eget mi vel turpis rutrum ultrices at non neque. Mauris quis arcu et sem commodo varius non at nulla. Pellentesque ac ex dictum, porta risus at, efficitur mauris. Vestibulum suscipit enim quam, eget efficitur nisi lobortis sed. Vestibulum sed vehicula nisl. Nunc turpis tellus, ultricies non mauris et, finibus tempor justo. Nunc non ligula at dolor fringilla aliquam non eget risus. Nam auctor consectetur lacus, sit amet mattis orci rhoncus in. In laoreet, ligula ut lacinia pellentesque, velit est viverra lorem, in ornare ipsum arcu a ante. Donec nec aliquet odio. Nullam ut mi sed dui scelerisque faucibus. Aenean ac sem id enim feugiat rhoncus.</p>
            <p>Suspendisse pulvinar mattis turpis vitae ullamcorper. Nam eu est congue, bibendum arcu a, consectetur massa. Donec pulvinar, ligula quis pulvinar posuere, urna est vulputate est, vel suscipit urna orci sed mi. Praesent pharetra tortor vel nulla pharetra, venenatis auctor libero lobortis. Ut facilisis id nibh sed tincidunt. Vivamus nec venenatis velit. Nullam faucibus, ligula vitae tincidunt sollicitudin, diam sapien aliquet nibh, quis fringilla orci tortor et libero. Integer sodales iaculis mi et mattis.</p>
            <p>Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas laoreet iaculis quam. Donec fringilla placerat quam, id pellentesque lacus pellentesque at. Etiam scelerisque, nunc eu iaculis viverra, turpis elit interdum mi, nec gravida mi turpis ac justo. Fusce ante ex, efficitur et auctor et, lobortis ac lorem. Maecenas neque nunc, aliquam eu odio et, aliquam aliquet velit. Aenean sed turpis et erat dictum auctor nec ac augue. Aliquam erat volutpat. Etiam aliquet mauris et sapien viverra, non suscipit mauris ullamcorper. Vestibulum ut laoreet ligula. Sed sit amet ipsum bibendum eros ullamcorper imperdiet nec ut nulla. Proin sed tristique tellus. Vivamus placerat facilisis est, id posuere neque posuere posuere. Etiam sollicitudin eleifend ex, ac aliquet ex tempus eget.</p>
            <p>Praesent pellentesque lorem tortor, id scelerisque libero consequat vitae. Maecenas vestibulum, orci a posuere tristique, lectus nisl convallis lacus, non efficitur enim dolor ac purus. Etiam ante massa, viverra sed ante id, faucibus fermentum turpis. Aliquam bibendum convallis dui a ultrices. Praesent bibendum ex diam, quis suscipit ligula viverra nec. Integer imperdiet bibendum vestibulum. Quisque sollicitudin laoreet ante ut consectetur. Donec fringilla non lectus sit amet hendrerit. Praesent quis tristique nibh, ut volutpat lectus. Suspendisse porttitor tellus vel leo cursus, et accumsan diam consequat. Quisque luctus in tellus sit amet auctor.</p>
        </content-text>
    </content-container>
</content-editor-component>

<?php CSSRenderer::add($baseClass, <<<CSS
    content-editor-component {
        display: block flex;
        flex-direction: column;
        width: 100%;
        height: 15em;
        overflow: scroll;

        border-radius: var(--size-xs);
        padding: var(--size-xs) calc(var(--size-xs) * 2);
        background-color: var(--clr-light);
        color: var(--clr-dark);
    }

    content-toolbar {
        display: block flex;
        width: fit-content;
        margin-inline: auto;
        padding: var(--size-s);
        gap: var(--size-xs);
    }

    content-container {
        display: block flex;
        flex-direction: column;
        gap: var(--size-s);
        flex-shrink: 0;
        min-height: 1em;
        border: 1px dashed red;

        & > content-toolbar { flex-direction: row; }
        
        &[content-direction="row"] {
            flex-direction: row;

            & > content-toolbar { flex-direction: column; }
        }
    }
CSS) ?>
