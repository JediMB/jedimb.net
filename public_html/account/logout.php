<?php declare(strict_types=1);

namespace Account;

require_once 'services/session.service.php';

use Services\SessionService;

$service = SessionService::getInstance(); /** @var SessionService $service */
$service->clearSession();

setcookie(COOKIE_USER_KEY, '');
setcookie(COOKIE_TOKEN_KEY, '');
setcookie(COOKIE_VALIDATOR_KEY, '');

header('Location: /');

?>