<?php declare(strict_types=1);

require_once 'models/user/user-login-request.model.php';
require_once 'models/user/user-login-response.model.php';
require_once 'services/db/user-token.db.service.php';
require_once 'services/db/user.db.service.php';

use Models\User\UserLoginRequest;
use Models\User\UserLoginResponse;
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
            $tokenService = UserTokenDBService::getInstance(); /** @var UserTokenDBService $tokenService */

            $dbPassword = $userService->getUserPassword($login->username);

            if ( !$dbPassword || !password_verify($login->password, $dbPassword->password) ) {
                session_unset();
                session_destroy();
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

            session_regenerate_id();
            $_SESSION[SESSION_STATUS_KEY] = true;
            $_SESSION[SESSION_USERNAME_KEY] = $login->username;
            $_SESSION[SESSION_USERID_KEY] = $id;

            return [ 'success' => true, 'value' => $response ];
        }
        catch (Exception $e) {
            return [ 'success' => false, 'errors' => [$e->getMessage()] ];
        }

    default:
        return [ 'success' => false, 'errors' => [ TEXT_INVALID_REQUEST ] ];

}

?>