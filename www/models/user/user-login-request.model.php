<?php declare(strict_types=1);

namespace Models\User;

require_once 'models/exceptions/input-exception.php';

use Models\Exceptions\InputException;
use Utils\Input;

class UserLoginRequest {
    public string $username;
    public string $password;
    public bool $persistent;

    public function __construct(array $postData) {
        $errors = [];

        $this->username = Input::verifyRequiredTextInput('username', $postData, INPUT_LENGTH['username'], $errors, REGEX_PHP['username']);
        $this->password = Input::verifyRequiredTextInput('password', $postData, INPUT_LENGTH['password'], $errors, REGEX_PHP['password']);
        $this->persistent = $postData['persistent'] ?? false;

        if (!empty($errors))
            throw new InputException(__CLASS__, $errors);
    }
}

?>