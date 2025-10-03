<?php declare(strict_types=1);

require_once 'models/user/user-login-request.model.php';
require_once 'models/user/user-login-response.model.php';
require_once 'services/session.service.php';
require_once 'services/db/user-token.db.service.php';
require_once 'services/db/user.db.service.php';

use Models\User\UserLoginRequest;
use Models\User\UserLoginResponse;
use Services\SessionService;
use Services\DB\UserDBService;
use Services\DB\UserTokenDBService;

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

            $userService = UserDBService::getInstance(); /** @var UserDBService $userService */
            $sessionService = SessionService::getInstance(); /** @var SessionService $sessionService */
            $tokenService = UserTokenDBService::getInstance(); /** @var UserTokenDBService $tokenService */

            $dbPassword = $userService->getUserPassword($login->username);

            if ( !$dbPassword || !password_verify($login->password, $dbPassword->password) ) {
                $sessionService->clearSession();
                return [ 'success' => false, 'errors' => [ TEXT_INCORRECT_LOGIN ] ];
            }

            $id = $dbPassword->id;

            if ($login->persistent) {
                do {
                    $selector = uniqid('', true);
                    $tokenMatch = $tokenService->getUserToken($selector);
                } while($tokenMatch);

                $validator = str_pad(dechex(rand(0x00000000, 0xFFFFFFFF)), 8, '0', STR_PAD_LEFT)
                            . str_pad(dechex(rand(0x00000000, 0xFFFFFFFF)), 8, '0', STR_PAD_LEFT);
                
                $validatorHash = password_hash($validator, PASSWORD_BCRYPT);

                $token = $tokenService->setUserToken($id, $selector, $validatorHash);

                $response = new UserLoginResponse($id, $selector, $validator, $token->expiresOn);
            }
            else
                $response = new UserLoginResponse($id);

            $sessionService->setSession($id, $login->username);

            return [ 'success' => true, 'value' => $response ];
        }
        catch (Exception $e) {
            return [ 'success' => false, 'errors' => [$e->getMessage()] ];
        }

    default:
        return [ 'success' => false, 'errors' => [ TEXT_INVALID_REQUEST ] ];

}

?>