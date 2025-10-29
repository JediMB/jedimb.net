<?php declare(strict_types=1);

require_once 'models/dto/configuration.dto.model.php';
require_once 'services/configuration.service.php';
require_once 'services/session.service.php';

use Enums\UserPermission;
use Models\DTO\Configuration;
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

if (empty($input))
    return Response::BadRequest('Request body is empty');

$configService = ConfigurationService::getInstance(); /** @var ConfigurationService $configService */

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'POST':
        try {
            foreach ($input as $config) {
                $configDTO = new Configuration($config);

                if (!in_array($configDTO->name, CONFIGURABLE_CONSTANTS)) {
                    $errors[] = 'Attempted to create new configuration for disallowed constant';
                    continue;
                }

                if ($configDTO->id !== 0) {
                    $errors[] = 'Attempted to create new configuration with non-zero id';
                    continue;
                }

                if (empty( ($result = $configService->createConfiguration($configDTO)) ))
                    $errors[] = "Failed to create: {$configDTO->name}";
            }

            if ($errors)
                return Response::Error($errors);

            return Response::Success(count($input));
        }
        catch (InvalidArgumentException $e) {
            return Response::BadRequest('Malformed request body: ' . $e->getMessage());
        }
        catch (Exception $e) {
            return Response::Error($errors + [$e->getMessage()]);
        }

    case 'PATCH':
        try {
            foreach ($input as $config) {
                $configDTO = new Configuration($config);

                if (!in_array($configDTO->name, CONFIGURABLE_CONSTANTS)) {
                    $errors[] = 'Attempted to create new configuration for disallowed constant';
                    continue;
                }
                
                $configDB = $configService->getConfiguration($configDTO->name)['config'];

                Configuration::update($configDB, $configDTO);

                if (empty( ($result = $configService->updateConfiguration($configDB)) ))
                    $errors[] = "Failed to update: {$configDTO->name}";
            }

            if ($errors)
                return Response::Error($errors);

            return Response::Success(count($input));
        }
        catch (InvalidArgumentException $e) {
            return Response::BadRequest('Malformed request body: ' . $e->getMessage());
        }
        catch (Exception $e) {
            return Response::Error($errors + [$e->getMessage()]);
        }

    default:
        return Response::InvalidRequest();
}

?>