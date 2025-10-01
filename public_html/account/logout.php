<?php declare(strict_types=1);

namespace Account;

require_once 'services/session.service.php';

use Services\SessionService;

$service = SessionService::getInstance(); /** @var SessionService $service */
$service->clearSession();

header('Location: /');

?>