<?php declare(strict_types=1);

namespace API\Session;

use Exception;
use App\Models\Exceptions\InputException;
use App\Models\App\User\UserLoginRequest;
use App\Models\App\User\UserLoginResponse;
use App\Services\SessionService;
use App\Services\UserService;

$input = json_decode(file_get_contents('php://input'), true);
$errors = [];

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'POST':
        try {
            $login = new UserLoginRequest($input);

            $userService = UserService::getInstance(); /** @var UserService $userService */
            $sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */

            $userId = $userService->authenticateUser($login->username, $login->password);

            if (!$userId) {
                $sessionService->clearSession();
                return [ 'success' => false, 'errors' => [ TEXT_INCORRECT_LOGIN ] ];
            }

            if ($login->persistent)
                $response = $userService->createUserToken($userId);
            else
                $response = new UserLoginResponse($userId);

            $user = $userService->getUser($userId);

            $sessionService->setSession($user, $response->token);

            return [ 'success' => true, 'value' => $response ];
        }
        catch (InputException $e) {
            return [ 'success' => false, 'errors' => $e->getErrors() ];
        }
        catch (Exception $e) {
            return [ 'success' => false, 'errors' => [$e->getMessage()] ];
        }

    default:
        return [ 'success' => false, 'errors' => [ TEXT_INVALID_REQUEST ] ];

}

?>