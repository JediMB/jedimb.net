<?php declare(strict_types=1);

use App\Enums\UserPermission;
use App\Models\DTO\ConfigurationDTO;
use App\Models\Exceptions\InputException;
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
try {
    switch ( $_SERVER['REQUEST_METHOD'] ) {
        case 'POST':
            foreach ($input as $key => $config) {
                try {
                    $configDTO = new ConfigurationDTO($config);

                    if (!ConfigurationService::isConfigurable($configDTO->name)) {
                        $errors[$configDTO->name] = 'Attempted to create new configuration for disallowed constant';
                        continue;
                    }

                    if ($configDTO->id !== 0) {
                        $errors[$configDTO->name] = 'Attempted to create new configuration with non-zero id';
                        continue;
                    }

                    if (empty( ($config = $configService->createConfiguration($configDTO)) )) {
                        $errors[$configDTO->name] = 'No created configuration returned from database';
                        continue;
                    }

                    $result[] = $config;
                }
                catch (InputException $e) {
                    $name = $config['name']
                        ?? throw new InvalidArgumentException("No name provided for input $key");

                    $errors[$name] = $e->getErrors();
                }
            }

            if ($errors) {
                if ($result)
                    return Response::Mixed($result, $errors);

                return Response::InputException($errors);
            }

            return Response::Success($result);
            

        case 'PATCH':
            foreach ($input as $key => $config) {
                try {
                    $configDTO = new ConfigurationDTO($config);


                    if (!ConfigurationService::isConfigurable($configDTO->name)) {
                        $errors[$configDTO->name] = 'Attempted to create new configuration for disallowed constant';
                        continue;
                    }

                    if ($configDTO->id < 1) {
                        $errors[$configDTO->name] = 'Attempted to patch configuration with invalid id';
                        continue;
                    }
                    
                    $configDB = $configService->getConfiguration($configDTO->name);

                    ConfigurationDTO::update($configDB, $configDTO);

                    if (empty( ($config = $configService->updateConfiguration($configDB)) )) {
                        $errors[$configDTO->name] = 'No updated configuration returned from database';
                        continue;
                    }

                    $result[] = $config;
                }
                catch (InputException $e) {
                    $name = $config['name']
                        ?? throw new InvalidArgumentException("No name provided for input $key");

                    $errors[$name] = $e->getErrors();
                }
            }

            if ($errors) {
                if ($result)
                    return Response::Mixed($result, $errors);

                return Response::InputException($errors);
            }
            
            return Response::Success($result);

        default:
            return Response::InvalidRequest();
    }
}
catch (InvalidArgumentException $e) {
    return Response::BadRequest('Malformed request body: ' . $e->getMessage());
}
catch (Exception $e) {
    return Response::Error([$e->getMessage()]);
}