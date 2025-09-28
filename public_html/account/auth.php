<?php declare(strict_types=1);

namespace Account;

require_once 'services/user.service.php';

use Services\UserService;

if (!isset($_POST['username'], $_POST['password']))
    exit('Please fill both the username and password fields!');

$service = UserService::getInstance();
/** @var UserService $service */

$user = $service->getUserPassword($_POST['username']);

if (!$user) {
    echo 'Incorrect user name or password';
    exit;
}

if ($user->id === 0) {
    echo 'Error accessing database.';
    return;
}

if (!password_verify($_POST['password'], $user->password)) {
    echo 'Incorrect (user name or) password';
    return;
}

session_regenerate_id();

$_SESSION['account_loggedin'] = true;
$_SESSION['account_name'] = $_POST['username'];
$_SESSION['account_id'] = $user->id;

echo 'Welcome back, ' . htmlspecialchars($_SESSION['account_name'], ENT_QUOTES) . '!';

header('Location: /');

?>