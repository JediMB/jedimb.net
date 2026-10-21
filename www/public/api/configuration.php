<?php declare(strict_types=1);

use App\Enums\UserPermission;
use App\Models\DTO\ConfigurationDTO;
use App\Services\ConfigurationService;
use App\Services\SessionService;
use App\Utils\Response;

$sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */

if (!$sessionService->isLoggedIn())
    return Response::Forbidden(TEXT_NOT_LOGGED_IN);

if (!$sessionService->hasPermissions([ UserPermission::Configuration ]))
    return Response::Forbidden(TEXT_INSUFFICIENT_PERMISSIONS);

$input = json_decode(file_get_contents('php://input'), true);
$result = [];
$errors = [];

if (empty($input))
    return Response::BadRequest('Request body is empty');

$configService = ConfigurationService::getInstance(); /** @var ConfigurationService $configService */

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'POST':
        try {
            $configDTOs = array_map(fn($config) => new ConfigurationDTO($config), $input);

            foreach ($configDTOs as $configDTO) {
                if (!ConfigurationService::isConfigurable($configDTO->name)) {
                    $errors[] = [
                        'name' => $configDTO->name,
                        'message' => 'Attempted to create new configuration for disallowed constant'
                    ];
                    continue;
                }

                if ($configDTO->id !== 0) {
                    $errors[] = [
                        'name' => $configDTO->name,
                        'message' => 'Attempted to create new configuration with non-zero id'
                    ];
                    continue;
                }

                if (is_int($configDTO->value) && $configDTO->value < 1) {
                    $errors[] = [
                        'name' => $configDTO->name,
                        'message' => 'Attempted to create a new configuration with a non-positive integer value'
                    ];
                    continue;
                }

                if (empty( ($config = $configService->createConfiguration($configDTO)) )) {
                    $errors[] = [
                        'name' => $configDTO->name,
                        'message' => 'No created configuration returned from database'
                    ];
                    continue;
                }

                $result[] = $config;
            }

            if ($errors) {
                if ($result)
                    return Response::Mixed($result, $errors);

                return Response::Error($errors);
            }

            return Response::Success($result);
        }
        catch (InvalidArgumentException $e) {
            return Response::BadRequest('Malformed request body: ' . $e->getMessage());
        }
        catch (Exception $e) {
            return Response::Error($errors + [$e->getMessage()]);
        }

    case 'PATCH':
        try {
            $configDTOs = array_map(fn($config) => new ConfigurationDTO($config), $input);

            foreach ($configDTOs as $configDTO) {
                if (!ConfigurationService::isConfigurable($configDTO->name)) {
                    $errors[] = [
                        'name' => $configDTO->name,
                        'message' => 'Attempted to create new configuration for disallowed constant'
                    ];
                    continue;
                }

                if (is_int($configDTO->value) && $configDTO->value < 1) {
                    $errors[] = [
                        'name' => $configDTO->name,
                        'message' => 'Attempted to create a new configuration with a non-positive integer value'
                    ];
                    continue;
                }
                
                $configDB = $configService->getConfiguration($configDTO->name);

                ConfigurationDTO::update($configDB, $configDTO);

                if (empty( ($config = $configService->updateConfiguration($configDB)) )) {
                    $errors[] = [
                        'name' => $configDTO->name,
                        'message' => 'No updated configuration returned from database'
                    ];
                    continue;
                }

                $result[] = $config;
            }

            if ($errors) {
                if ($result)
                    return Response::Mixed($result, $errors);

                return Response::Error($errors);
            }
            
            return Response::Success($result);
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