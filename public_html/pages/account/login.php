<?php declare(strict_types=1);

namespace Account;

use DateTime;

$title = 'Login';

if (isset($_SESSION[SESSION_STATUS_KEY])) {
    header('Location: /');
    exit;
}

?>

<div class="w-80 mx-auto">
    <form id="form-login" class="flex flex-col gap-3">
        <div>
            <label for="username">Username</label>
            <input type="text" name="username" id="username" placeholder="Username"
                pattern="<?= trim(REGEX_INPUT['username'], '/') ?>" required
                minlength="<?= INPUT_LENGTH['username']['min'] ?>"
                maxlength="<?= INPUT_LENGTH['username']['max'] ?>"
                title="<?= TEXT_USERNAME_LENGTH . ' ' . TEXT_USERNAME_CHARS ?>"
                class="w-full p-1 text-black">
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" name="password" id="password" placeholder="Password"
                pattern="<?= trim(REGEX_INPUT['password'], '/') ?>" required
                minlength="<?= INPUT_LENGTH['password']['min'] ?>"
                maxlength="<?= INPUT_LENGTH['password']['max'] ?>"
                title="<?= TEXT_PASSWORD_LENGTH . ' ' . TEXT_PASSWORD_CHARS ?>"
                class="w-full p-1 text-black">
        </div>
        <div>
            <input type="checkbox" name="rememberme" id="rememberme">
            <label for="rememberme">Remember me</label>
        </div>
        <button type="submit" class="btn btn-login">Login</button>
    </form>
    <div id="login-errors"></div>
</div>

<script type="module">
    import UserApiService from '/js/services/api/user-api.service.js';

    const userApiService = new UserApiService();

    const form = document.querySelector('#form-login');
    const inputs = form.querySelectorAll('[pattern]');
    const loginBtn = form.querySelector('[type=submit]');
    const errorContainer = document.querySelector('#login-errors');

    // TODO: Button [disabled] CSS, keep the button disabled if fields are invalid

    const login = async (event) => {
        // TODO: On-submit form validation (RegEx?)
        event.submitter.disabled = true;
        errorContainer.textContent = '';
        const formData = new FormData(form);

        const data = await userApiService.login(formData);

        if (data.success) {
            if (data.value.token) {
                const expires = data.value.expiresOn.toUTCString();
                document.cookie = `<?= COOKIE_USER_KEY ?>=${data.value.userId}; expires=${expires};`
                document.cookie = `<?= COOKIE_TOKEN_KEY ?>=${data.value.token}; expires=${expires};`
                document.cookie = `<?= COOKIE_VALIDATOR_KEY ?>=${data.value.validator}; expires=${expires};`;
            }
            
            setTimeout(() => window.location.href = '/', 5000);
            return;
        }

        data.errors.forEach(error => {
            const newError = document.createElement('div');
            newError.classList.add('error');
            newError.textContent = error;
            errorContainer.appendChild(newError);
        });

        event.submitter.disabled = false;
    }

    const validateForm = () => {
        let isValid = true;

        inputs.forEach(input => {
            if (input.checkValidity())
                return;

            isValid = false;
        });

        loginBtn.disabled = !isValid;
    }

    inputs.forEach(input => {
        if (!input.checkValidity())
            loginBtn.disabled = true;

        input.addEventListener('input', validateForm);
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        login(event);
    });
</script>