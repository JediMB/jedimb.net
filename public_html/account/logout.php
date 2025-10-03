<?php declare(strict_types=1);

namespace Account;

require_once 'services/session.service.php';

use Services\SessionService;

$service = SessionService::getInstance(); /** @var SessionService $service */
$service->clearSession();

$pastExpiration = time()-86400;
setcookie(COOKIE_USER_KEY, '', $pastExpiration);
setcookie(COOKIE_TOKEN_KEY, '', $pastExpiration);
setcookie(COOKIE_VALIDATOR_KEY, '', $pastExpiration);

header('Location: /');

?>