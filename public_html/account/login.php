<?php declare(strict_types=1);

namespace Account;

$title = 'Login';

if (isset($_SESSION['account_loggedin'])) {
    header('Location: /');
    exit;
}

?>

<div>X-Men! Welcome to login!</div>

<div class="w-80 mx-auto">
    <form id="form-login" class="flex flex-col gap-3">
        <div>
            <label for="username">User name</label>
            <input type="text" name="username" id="username" placeholder="User name" required class="w-full p-1 text-black">
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" name="password" id="password" placeholder="Password" required class="w-full p-1 text-black">
        </div>
        <div>
            <input type="checkbox" name="rememberme" id="rememberme">
            <label for="rememberme">Remember me</label>
        </div>
        <button type="submit" class="btn hover:bg-hotpink-500 hover:text-black">Login</button>
    </form>
</div>

<script type="module">
    import UserApiService from '/js/services/api/user-api.service.js';

    const userApiService = new UserApiService();

    const form = document.querySelector("#form-login");

    async function Login() {
        const formData = new FormData(form);

        const data = await userApiService.login(formData);
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        Login();
    });
</script>