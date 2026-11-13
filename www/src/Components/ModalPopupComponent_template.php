<?php declare(strict_types=1);

use App\Components\ModalPopupComponent;

/** @var ModalPopupComponent $data */
/** @var string $baseClass */
/** @var string $baseId */

?>

<modal-popup-component>
    <style>
        .<?= $baseClass ?>__background {
            position: fixed;
            overflow: hidden;
            z-index: 9999;
            display: block;
            inset: 0;
            backdrop-filter: blur(5px) brightness(30%);
        }

        .<?= $baseClass ?>__box {
            margin: 15% auto;
            display: block flex;
            flex-direction: column;
            gap: var(--size-ml);
            max-width: 50vw;
            border: var(--size-xxs) solid var(--clr-text);
            border-radius: var(--size-m);
            padding: var(--size-l);
            background-color: var(--clr-bg);
            color: var(--clr-primary);
        }

        .<?= $baseClass ?>__heading {
            margin: 0;
            font-size: var(--size-ml);
        }

        .<?= $baseClass ?>__body {
            display: block flex;
            flex-direction: column;
            gap: var(--size-ms);
            font-size: var(--size-m);
            max-height: 35svh;
            overflow-y: scroll;
        }

        .<?= $baseClass ?>__buttons {
            display: block flex;
            flex-direction: row;
            gap: var(--size-m);
            justify-content: end;
        }
    </style>

    <div class="<?= "{$baseClass}__background" ?>">
        <dialog class="<?= "{$baseClass}__box" ?>" open>
                <h1 class="<?= "{$baseClass}__heading" ?>">
                    Heading
                </h1>
                <div class="<?= "{$baseClass}__body" ?>">
                    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in massa ultrices, lobortis risus non, lacinia ante. Maecenas eros nulla, bibendum ut efficitur ac, sodales laoreet dui. Mauris vulputate erat vitae purus maximus, a consectetur ligula tempus. Sed blandit ante nisl, sed tincidunt dui porta id. Mauris id ante scelerisque, facilisis augue scelerisque, suscipit eros. Praesent in elit risus. Nam non pretium mi. Vivamus sed metus quis turpis malesuada rutrum at sit amet libero. Etiam placerat dui tellus, vitae varius sem pellentesque vitae. Nulla mi ligula, egestas eget orci in, ultrices accumsan sem. Mauris iaculis elementum nibh. Sed euismod purus ut suscipit imperdiet. Ut quis sem posuere, bibendum tellus vitae, venenatis diam. Integer convallis elit at gravida fermentum.</div>
                    <div>Etiam at neque nunc. Mauris pulvinar ex eget dui euismod, id dapibus neque accumsan. In molestie eleifend feugiat. Quisque bibendum massa ut leo rhoncus, a tincidunt mauris porttitor. Nam non mi congue, ultricies lorem vel, malesuada nulla. Sed pharetra risus ante. Integer porttitor arcu a convallis iaculis. Nunc vehicula, augue eget condimentum facilisis, turpis ex iaculis libero, nec sagittis justo mauris sit amet enim. Phasellus nec sapien ut sapien tristique efficitur.</div>
                    <div>Praesent ut velit semper, iaculis diam sed, suscipit enim. Donec nec orci eget dui congue placerat. Duis et est mattis, vehicula augue at, accumsan justo. Curabitur eget neque elit. Suspendisse vestibulum, nulla eu porta rutrum, arcu lorem ultrices sapien, vitae tempor dui orci quis lacus. Curabitur accumsan quis tortor quis ultrices. Vivamus quis libero pulvinar, tincidunt lacus at, ultrices massa. Sed in pulvinar orci. Donec sed lacinia orci, ac dictum magna.</div>
                    <div>Nunc eget diam et risus maximus molestie. Vivamus pharetra dictum lorem, ac congue metus porttitor vel. Nunc nulla dui, eleifend vitae dapibus eget, laoreet quis mauris. Nunc nibh mauris, consequat a arcu a, mollis ornare ligula. Vivamus ac libero volutpat, ullamcorper ex at, mattis tellus. Sed mollis nibh nibh. Maecenas sodales aliquet leo, ac congue lacus ultrices ut. Cras eget eros lacus. Aliquam tempus pulvinar risus vel aliquam.</div>
                    <div>Fusce iaculis, enim id volutpat ullamcorper, elit justo rutrum arcu, vitae fringilla diam nisi quis mi. Sed at accumsan quam. Mauris pulvinar est sit amet mi elementum, eget hendrerit neque viverra. In rhoncus ligula at facilisis placerat. Praesent mi nulla, ultricies et porta quis, posuere ut orci. Phasellus porta libero ut pharetra accumsan. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce sit amet magna orci. Duis et nulla quis nisi porta maximus.</div>
                </div>
                <menu class="<?= "{$baseClass}__buttons" ?>">
                    <li>
                        <button type="button"
                            class="btn-secondary">
                            Close
                        </button>
                    </li>
                    <li>
                        <button type="button"
                            class="btn-secondary">
                            Close
                        </button>
                    </li>
                </menu>
        </dialog>
    </div>
</modal-popup-component>
