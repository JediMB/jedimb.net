<?php $title = 'Login';

if (isset($_SESSION['account_loggedin'])) {
    header('Location: /');
    exit;
}
?>

<div>X-Men! Welcome to login!</div>

<div class="w-80 mx-auto">
    <form action="/api/auth" method="post" class="flex flex-col gap-3">
        <div>
            <label for="username">User name</label>
            <input type="text" name="username" id="username" placeholder="User name" required class="w-full p-1 text-black">
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" name="password" id="password" placeholder="Password" required class="w-full p-1 text-black">
        </div>
        <button type="submit" class="btn hover:bg-hotpink-500 hover:text-black">Login</button>
    </form>
</div>