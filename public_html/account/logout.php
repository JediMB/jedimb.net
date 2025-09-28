<?php declare(strict_types=1);

namespace Account;

session_unset();
session_destroy();
header('Location: /');

?>