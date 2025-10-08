<?php declare(strict_types=1);

require_once 'models/user/user-login-request.model.php';
require_once 'models/user/user-login-response.model.php';
require_once 'services/session.service.php';
require_once 'services/user.service.php';

use Models\Exceptions\InputException;
use Models\User\UserLoginRequest;
use Models\User\UserLoginResponse;
use Services\SessionService;
use Services\UserService;

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

            $sessionService->setSession($userId, $response->token);

            return [ 'success' => true, 'value' => $response ];
        }
        catch (InputException $e) {
            return [ 'success' => false, 'errors' => $e->getMessages() ];
        }
        catch (Exception $e) {
            return [ 'success' => false, 'errors' => [$e->getMessage()] ];
        }

    default:
        return [ 'success' => false, 'errors' => [ TEXT_INVALID_REQUEST ] ];

}

?>