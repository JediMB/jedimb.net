 <?php declare(strict_types=1);
 $createdString = $createdOn->format('Y-m-d H:i:s')
 ?>

<span>
    <date-time server-time="<?= $createdString ?>" class="capitalize">
        <?= $createdString ?>
    </date-time>
</span>

<?php if (!empty($modifiedOn)): ?>
    <?php $modifiedString = $modifiedOn->format('Y-m-d H:i:s') ?>
    <span class="weak">
        – Last modified 
        <date-time server-time="<?= $modifiedString ?>">
            <?= $modifiedString ?>
        </date-time>.
    </span>
<?php endif ?>