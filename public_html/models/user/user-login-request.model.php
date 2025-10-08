<?php declare(strict_types=1);

namespace Models\User;

require_once 'models/exceptions/input-exception.php';

use Models\Exceptions\InputException;

class UserLoginRequest {
    public string $username;
    public string $password;
    public bool $persistent;

    public function __construct(array $postData) {
        $errors = [];

        if (empty($postData['username']))
            $errors[] = ucfirst(TEXT_USERNAME) . TEXT_INPUT_MISSING;
        else {
            $username = trim($postData['username']);

            if (strlen($username) < INPUT_LENGTH['username']['min'])
                $errors[] = ucfirst(TEXT_USERNAME) . TEXT_INPUT_TOOSHORT;
            else if (strlen($username) > INPUT_LENGTH['username']['max'])
                $errors[] = ucfirst(TEXT_USERNAME) . TEXT_INPUT_TOOSHORT;
            else if (!preg_match(REGEX_INPUT['username'], $username))
                $errors[] = ucfirst(TEXT_USERNAME) . TEXT_INPUT_MISMATCH;
            else
                $this->username = $username;
        }

        if (empty($postData['password']))
            $errors[] = ucfirst(TEXT_PASSWORD) . TEXT_INPUT_MISSING;
        else {
            $password = trim($postData['password']);

            if (strlen($password) < INPUT_LENGTH['password']['min'])
                $errors[] = ucfirst(TEXT_PASSWORD) . TEXT_INPUT_TOOSHORT;
            else if (strlen($password) > INPUT_LENGTH['password']['max'])
                $errors[] = ucfirst(TEXT_PASSWORD) . TEXT_INPUT_TOOSHORT;
            else if (!preg_match(REGEX_INPUT['password'], $password))
                $errors[] = ucfirst(TEXT_PASSWORD) . TEXT_INPUT_MISMATCH;
            else
                $this->password = $password;
        }

        $this->persistent = $postData['persistent'] ?? false;

        if (!empty($errors))
            throw new InputException($errors);
            
    }
}

?>