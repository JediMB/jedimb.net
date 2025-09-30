<?php declare(strict_types=1);

use Services\UserService;

require_once 'models/user/user-login-request.model.php';
require_once 'models/user/user-login-response.model.php';
require_once 'services/user.service.php';

use Models\User\UserLoginRequest;
use Models\User\UserLoginResponse;
use Models\User\UserToken;

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

            $service = UserService::getInstance();
            /** @var UserService $service */
            $dbPassword = $service->getUserPassword($login->username);

            if ( !$dbPassword || !password_verify($login->password, $dbPassword->password) ) {
                session_unset();
                session_destroy();
                return [ 'success' => false, 'errors' => [ TEXT_INCORRECT_LOGIN ] ];
            }

            $id = $dbPassword->id;

            if ($login->persistent) {
                do {
                    $selector = uniqid('', true);
                    $tokenMatch = $service->getUserToken($selector);
                } while($tokenMatch);

                $validator = str_pad(dechex(rand(0x00000000, 0xFFFFFFFF)), 8, '0', STR_PAD_LEFT)
                            . str_pad(dechex(rand(0x00000000, 0xFFFFFFFF)), 8, '0', STR_PAD_LEFT);
                
                $validatorHash = password_hash($validator, PASSWORD_BCRYPT);

                $token = $service->setUserToken($id, $selector, $validatorHash);

                $response = new UserLoginResponse($id, $selector, $validator, $token->expiresOn);
            }
            else
                $response = new UserLoginResponse($id);

            session_regenerate_id();
            $_SESSION['account_loggedin'] = true;
            $_SESSION['account_name'] = $login->username;
            $_SESSION['account_id'] = $id;

            return [ 'success' => true, 'value' => $response ];
        }
        catch (Exception $e) {
            return [ 'success' => false, 'errors' => [$e->getMessage()] ];
        }

    default:
        return [ 'success' => false, 'errors' => [ TEXT_INVALID_REQUEST ] ];

}

?>