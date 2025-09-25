<?php $title = 'Login';

if (isset($_SESSION['account_loggedin'])) {
    header('Location: /');
    exit;
}
?>

<div>X-Men! Welcome to login!</div>

<form action="/api/auth" method="post" class="flex flex-col">
    <label for="username">User name</label>
    <input type="text" name="username" id="username" placeholder="User name" required>
    <label for="password">Password</label>
    <input type="password" name="password" id="password" placeholder="Password" required>
    <button type="submit">Login</button>
</form>