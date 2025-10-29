<?php declare(strict_types=1);

namespace Services;

require_once 'enums/user-permission.enum.php';
require_once 'models/user/user.model.php';
require_once 'services/base/singleton.php';
require_once 'services/user.service.php';
require_once 'services/db/user-token.db.service.php';

use DateTime;
use Exception;
use Enums\UserRole;
use Enums\UserPermission;
use Models\DB\UserToken;
use Models\User\User;
use Services\Base\Singleton;
use Services\UserService;
use Services\DB\UserTokenDBService;

class SessionService extends Singleton {
    private UserTokenDBService $tokenDBService;
    private UserService $userService;
    private array $userRolePermissions;

    protected function __construct() {
        session_start();

        $this->tokenDBService = UserTokenDBService::getInstance();
        $this->userService = UserService::getInstance();

        $this->userRolePermissions = [
            UserRole::Administrator->value => [
                UserPermission::Configuration, UserPermission::Publishing, UserPermission::Editing, UserPermission::Deleting
            ],
            UserRole::Contributor->value => [
                UserPermission::Publishing, UserPermission::Editing, UserPermission::Deleting
            ]
        ];
    }

    public function clearSession() {
        session_unset();
        session_destroy();
    }

    public function enforcePermissions(array $permissionRequirements) {
        if (!$this->hasPermissions($permissionRequirements))
            servePHP([
                'header' => 'HTTP/1.1 403 Forbidden',
                'pagePath' => PATH_ERROR403
            ]);
    }

    public function getUser() : User|false {
        return $_SESSION[SESSION_USER_KEY] ?? false;
    }

    public function hasPermissions(array $permissionRequirements) : bool {
        $user = $this->getUser();

        if (!$user)
            servePHP([
                'header' => 'HTTP/1.1 403 Forbidden',
                'pagePath' => PATH_ERROR403
            ]);

        if (empty($this->userRolePermissions[$user->role->value]))
            throw new Exception('No permissions defined for user role');

        foreach ($permissionRequirements as $requirement) { /** @var UserPermission $requirement */
            $match = false;
            foreach ($this->userRolePermissions[$user->role->value] as $permission) { /** @var UserPermission $permission */
                if ($requirement !== $permission)
                    continue;

                $match = true;
                break;
            }

            if (!$match)
                return false;
        }

        return true;
    }

    public function isLoggedIn() : bool {
        return isset($_SESSION[SESSION_STATUS_KEY]);
    }

    public function loginFromCookie() : bool {
        $token = $this->verifyCookie();

        if (!$token)
            return false;

        $user = $this->userService->getUser($token->userId);

        if (!$user)
            return false;

        $this->setSession($user, $token->selector);
        $this->tokenDBService->refreshUserToken($token->id);
        return true;
    }

    public function setSession(User $user, ?string $tokenSelector) {
        session_regenerate_id();
        $_SESSION[SESSION_STATUS_KEY] = true;
        $_SESSION[SESSION_TOKEN_KEY] = $tokenSelector;
        $_SESSION[SESSION_USER_KEY] = $user;
    }

    public function verifyCookie() : UserToken|false {
        if (!isset($_COOKIE[COOKIE_USER_KEY], $_COOKIE[COOKIE_TOKEN_KEY], $_COOKIE[COOKIE_VALIDATOR_KEY]))
            return false;

        $userId = (int) $_COOKIE[COOKIE_USER_KEY];
        $selector = $_COOKIE[COOKIE_TOKEN_KEY];
        $validator = $_COOKIE[COOKIE_VALIDATOR_KEY];

        try {
            $token = $this->tokenDBService->getUserToken($selector);
            
            if ( !$token ) {
                return false;
            }
            
            if ( $token->expiresOn < new DateTime() )
                return false;

            if ( $userId !== $token->userId )
                return false;

            if ( !password_verify($validator, $token->validator_hash) )
                return false;

            return $token;
        }
        catch (Exception $e) {
            throw new Exception('Error verifying cookie: ' . $e->getMessage());
        }
    }
}

?>