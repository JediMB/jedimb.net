<?php declare(strict_types=1);

use App\Components\AccountMenuComponent;

/** @var AccountMenuComponent $data */

?>

<account-menu-component>
    <!-- Change to actual button -->
    <account-menu-button>
        <a href="#" id="account-menu-toggle">
            <svg width="2rem" height="2rem">
                <use xlink:href="#svg-gear" href="#svg-gear"></use>
            </svg>
        </a>
    </account-menu-button>

    <account-menu hidden>
        <div menu-logged-out <?= $data->isLoggedIn ? 'hidden' : '' ?>>
            <h2 class="account-menu__h2">Login</h2>
            <form>
                <div>
                    <label for="username">Username</label>
                    <input type="text" name="username" id="username" placeholder="Username"
                        pattern="<?= REGEX_HTML['username'] ?>" required
                        data-too-short="Username too short: <?= TEXT_USERNAME_LENGTH ?>"
                        data-too-long="Username too long: <?= TEXT_USERNAME_LENGTH ?>"
                        data-mismatch="<?= TEXT_USERNAME_CHARS ?>"
                        minlength="<?= INPUT_LENGTH['username']['min'] ?>"
                        maxlength="<?= INPUT_LENGTH['username']['max'] ?>"
                        title="<?= TEXT_USERNAME_LENGTH . ' ' . TEXT_USERNAME_CHARS ?>"
                        >
                    <div input-error></div>
                </div>
                <div>
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="Password"
                        pattern="<?= REGEX_HTML['password'] ?>" required
                        data-too-short="Password too short: <?= TEXT_PASSWORD_LENGTH ?>"
                        data-too-long="Password too long: <?= TEXT_PASSWORD_LENGTH ?>"
                        data-mismatch="<?= TEXT_PASSWORD_CHARS ?>"
                        minlength="<?= INPUT_LENGTH['password']['min'] ?>"
                        maxlength="<?= INPUT_LENGTH['password']['max'] ?>"
                        title="<?= TEXT_PASSWORD_LENGTH . ' ' . TEXT_PASSWORD_CHARS ?>"
                        >
                    <div input-errors></div>
                </div>
                <div>
                    <label>
                        <input type="checkbox" name="rememberme" id="rememberme">
                        Remember me
                    </label>
                </div>
                <button type="submit" class="btn btn-login" disabled>Login</button>
                <div id="login-errors"></div>
            </form>
        </div>
        <ul menu-logged-in <?= $data->isLoggedIn ? '' : 'hidden' ?>
            class="account-menu__list">
            <li><a href="/admin">Administration</a></li>
            <li><a href="#" class="account-menu__logout">Logout</a></li>
        </ul>
    </account-menu>
</account-menu-component>
