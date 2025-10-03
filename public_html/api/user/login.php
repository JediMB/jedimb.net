<?php declare(strict_types=1);

require_once 'models/user/user-login-request.model.php';
require_once 'models/user/user-login-response.model.php';
require_once 'services/session.service.php';
require_once 'services/user.service.php';

use Models\User\UserLoginRequest;
use Models\User\UserLoginResponse;
use Services\SessionService;
use Services\UserService;

$input = json_decode(file_get_contents('php://input'), true);
$errors = [];

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'POST':
        try {
            $login = new UserLoginRequest($input); // TODO: Additional form validation (RegEx? In model constructor?)

            if (empty($login->username))
                $errors[] = TEXT_USERNAME_MISSING;
            if (empty($login->password))
                $errors[] = TEXT_PASSWORD_MISSING;
            if ($errors)
                return [ 'success' => false, 'errors' => $errors ];

            $userService = UserService::getInstance(); /** @var UserService $userService */
            $sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */

            $userId = $userService->authenticateUser($login->username, $login->password);

            if (!$userId) {
                $sessionService->clearSession();
                return [ 'success' => false, 'errors' => [ TEXT_INCORRECT_LOGIN ] ];
            }

            $sessionService->setSession($userId, $login->username);

            if ($login->persistent)
                $response = $userService->createUserToken($userId);
            else
                $response = new UserLoginResponse($userId);

            return [ 'success' => true, 'value' => $response ];
        }
        catch (Exception $e) {
            return [ 'success' => false, 'errors' => [$e->getMessage()] ];
        }

    default:
        return [ 'success' => false, 'errors' => [ TEXT_INVALID_REQUEST ] ];

}

?>