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
                data-mismatch="<?= TEXT_USERNAME_CHARS ?>"
                minlength="<?= INPUT_LENGTH['username']['min'] ?>"
                maxlength="<?= INPUT_LENGTH['username']['max'] ?>"
                title="<?= TEXT_USERNAME_LENGTH . ' ' . TEXT_USERNAME_CHARS ?>"
                class="w-full p-1 text-black">
            <div></div>
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" name="password" id="password" placeholder="Password"
                pattern="<?= trim(REGEX_INPUT['password'], '/') ?>" required
                data-mismatch="<?= TEXT_PASSWORD_CHARS ?>"
                minlength="<?= INPUT_LENGTH['password']['min'] ?>"
                maxlength="<?= INPUT_LENGTH['password']['max'] ?>"
                title="<?= TEXT_PASSWORD_LENGTH . ' ' . TEXT_PASSWORD_CHARS ?>"
                class="w-full p-1 text-black">
            <div></div>
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

    const addErrorMessage = (element, message) => {
        const newError = document.createElement('div');
        newError.classList.add('error');
        newError.textContent = message;
        element.appendChild(newError);
    };

    const validateForm = (source, eventType) => {
        let isValid = true;

        inputs.forEach(input => {
            if (input.checkValidity()) {
                if (eventType === 'input' && source === input && input.nextElementSibling) {
                    input.classList.remove('error');
                console.log(input.validity);
                    input.nextElementSibling.innerHTML = '';
                }

                return;
            }

            if (eventType === 'change' && source === input) {

                input.classList.add('error');
                console.log(input.validity);
                
                // TODO: Verify that the sibling is actually the desired element
                if (input.nextElementSibling) {
                    input.nextElementSibling.textContent = '';

                    if (input.validity.tooShort)
                        addErrorMessage(input.nextElementSibling, '<?= TEXT_INPUT_TOOSHORT ?>');
                    else if (input.validity.tooLong)
                        addErrorMessage(input.nextElementSibling, '<?= TEXT_INPUT_TOOLONG ?>');
                    if (input.validity.patternMismatch)
                        addErrorMessage(input.nextElementSibling, input.dataset.mismatch);
                }
            }
            isValid = false;
        });

        loginBtn.disabled = !isValid;
    }

    inputs.forEach(input => {
        if (!input.checkValidity())
            loginBtn.disabled = true;

        input.addEventListener('input', () => validateForm(input, 'input'));
        input.addEventListener('change', () => validateForm(input, 'change'));
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        login(event);
    });
</script>