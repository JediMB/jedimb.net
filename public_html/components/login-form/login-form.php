<?php declare(strict_types=1);

namespace Components;

require_once 'utilities/component.utility.php';

use Utilities\Component;

Component::renderCSS(__FILE__);
Component::queueJS(__FILE__);

?>

<login-form-container>
    <form id="form-login" class="flex flex-col gap-3">
        <div>
            <label for="username">Username</label>
            <input type="text" name="username" id="username" placeholder="Username"
                pattern="<?= trim(REGEX_INPUT['username'], '/') ?>" required
                data-too-short="Username too short: <?= TEXT_USERNAME_LENGTH ?>"
                data-too-long="Username too long: <?= TEXT_USERNAME_LENGTH ?>"
                data-mismatch="<?= TEXT_USERNAME_CHARS ?>"
                minlength="<?= INPUT_LENGTH['username']['min'] ?>"
                maxlength="<?= INPUT_LENGTH['username']['max'] ?>"
                title="<?= TEXT_USERNAME_LENGTH . ' ' . TEXT_USERNAME_CHARS ?>"
                class="w-full p-1 text-black">
            <div input-error></div>
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" name="password" id="password" placeholder="Password"
                pattern="<?= trim(REGEX_INPUT['password'], '/') ?>" required
                data-too-short="Password too short: <?= TEXT_PASSWORD_LENGTH ?>"
                data-too-long="Password too long: <?= TEXT_PASSWORD_LENGTH ?>"
                data-mismatch="<?= TEXT_PASSWORD_CHARS ?>"
                minlength="<?= INPUT_LENGTH['password']['min'] ?>"
                maxlength="<?= INPUT_LENGTH['password']['max'] ?>"
                title="<?= TEXT_PASSWORD_LENGTH . ' ' . TEXT_PASSWORD_CHARS ?>"
                class="w-full p-1 text-black">
            <div input-error></div>
        </div>
        <div>
            <input type="checkbox" name="rememberme" id="rememberme">
            <label for="rememberme">Remember me</label>
        </div>
        <button type="submit" class="btn btn-login" disabled="">Login</button>
    </form>
    <div id="login-errors"></div>
</login-form-container>