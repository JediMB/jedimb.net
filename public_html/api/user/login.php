<?php declare(strict_types=1);

use Services\UserService;

require_once 'models/user/user-login-response.model.php';
require_once 'services/user.service.php';

use Models\User\UserLoginResponse;

$input = json_decode(file_get_contents('php://input'), true);
$errors = [];

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'POST':
        try {
            if (empty($input['username']))
                $errors[] = 'Username required';
            if (empty($input['password']))
                $errors[] = 'Password required';
            if ($errors)
                return [ 'success' => false, 'errors' => $errors ];

            $service = UserService::getInstance();
            /** @var UserService $service */
            $dbPassword = $service->getUserPassword($input['username']);

            if ( !$dbPassword || !password_verify($input['password'], $dbPassword->password) ) {
                session_unset();
                session_destroy();
                return [ 'success' => false, 'errors' => ['Incorrect username or password'] ];
            }

            session_regenerate_id();
            $_SESSION['account_loggedin'] = true;
            $_SESSION['account_name'] = $input['username'];
            $_SESSION['account_id'] = $dbPassword->id;

            $response = new UserLoginResponse($dbPassword->id, 'test', 'test');

            return [ 'success' => true, 'value' => $response ];
        }
        catch (Exception $e) {
            return [ 'success' => false, 'errors' => [$e->getMessage()] ];
        }

    default:
        return [ 'success' => false, 'errors' => ['Invalid request method'] ];

}

?>