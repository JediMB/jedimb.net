<?php declare(strict_types=1);

require_once 'services/configuration.service.php';
require_once 'services/session.service.php';

use Enums\UserPermission;
use Services\ConfigurationService;
use Services\SessionService;
use Utilities\Response;

$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */

if (!$sessionService->isLoggedIn())
    return Response::Forbidden(TEXT_NOT_LOGGED_IN);

if (!$sessionService->hasPermissions([ UserPermission::Configuration ]))
    return Response::Forbidden(TEXT_INSUFFICIENT_PERMISSIONS);

$input = json_decode(file_get_contents('php://input'), true);
$errors = [];

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'POST':
        return Response::Success($input);

    case 'PATCH':
        return Response::Success($input);

    default:
        return Response::InvalidRequest();
}

?>