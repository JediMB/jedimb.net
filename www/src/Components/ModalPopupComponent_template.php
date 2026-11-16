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

            & > :first-child {
                margin-block-start: 0;
            }

            & > :last-child {
                margin-block-end: 0;
            }
        }

        .<?= $baseClass ?>__buttons {
            display: block flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: var(--size-m);
            justify-content: end;
        }
    </style>

    <template>
        <modal-popup class="<?= "{$baseClass}__background" ?>">
            <dialog class="<?= "{$baseClass}__box" ?>" open>
                <h1 class="<?= "{$baseClass}__heading" ?>"></h1>
                <modal-body class="<?= "{$baseClass}__body" ?>"></modal-body>
                <menu class="<?= "{$baseClass}__buttons" ?>"></menu>
            </dialog>
        </modal-popup>
    </template>
</modal-popup-component>
