<?php

define('CONFIG_PATH', '.configuration.json');
define('SECRETS_PATH', '.secrets.json');

define('PATH_VIRTUALPAGE', 'page.php');
define('PATH_ERROR403', 'includes/errors/403.php');
define('PATH_ERROR404', 'includes/errors/404.php');

define('SITE_TITLE', 'JediMB.net');
define('SITE_AUTHOR', 'JediMB');
define('SITE_CREATEDYEAR', '2025');
define('SITE_TEMPLATE', 'default.php');
define('SITE_HOME', 'blog/blog.php');

define('DB_OPTIONS', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
define('INVALID_USER_AGENTS', [
        'anthropic-ai',
        'claude-web',
        'applebot-extended',
        'bytespider',
        'ccbot',
        'chatgpt-user',
        'cohere-ai',
        'diffbot',
        'facebookbot',
        'googleother',
        'google-extended',
        'gptbot',
        'imagesiftbot',
        'perplexitybot',
        'omigilibot',
        'omigili',
]);

require_once 'includes/services/singleton.php';

use Services\Singleton;

class Configuration extends Singleton{
    public string $pageTitle;
    public string $pageTemplate;
    public string $pageYear;
    public string $pageContent;

    public array $pageRoutes;
    public string $pageId;

    public string $dbDSN;
    public string $dbUser;
    public string $dbPass;
    public string $dbSchema;

    protected function __construct() {
        $this->pageTitle = SITE_TITLE;
        $this->pageTemplate  = realpath('includes/views/' . SITE_TEMPLATE);
        $this->pageYear = SITE_CREATEDYEAR;
        $this->pageContent = 'Page content';

        $this->setConfiguration();

        if (SECRETS_PATH)
            $this->setSecrets();
    }

    private function setConfiguration() {
        try {
            $fileName = CONFIG_PATH;

            if ( is_file($fileName) == false )
                return null;

            $jsonFile = fopen($fileName, 'r');
            $jsonObj = fread($jsonFile, filesize($fileName));
            fclose($jsonFile);

            $obj = json_decode($jsonObj);
            
            if (!isset($obj->configuration))
                throw new Exception('No configuration found.');

            $GLOBALS['configuration'] = $obj->configuration;
        }
        catch (Exception $e) {
            echo 'Error: Invalid website configuration.<br />' . $e->getMessage();
            exit;
        }
    }

    private function readSecrets() {
        try {
            ($secretsPath = realpath(SECRETS_PATH)) ?: throw new Exception('Secrets not found.');

            if ( ($jsonSize = filesize($secretsPath)) <= 0 )
                throw new Exception('Zero-size secrets file.');

            $jsonFile = fopen($secretsPath, 'r');
            $jsonObj = fread($jsonFile, $jsonSize);
            fclose($jsonFile);

            $obj = json_decode($jsonObj);

            return $obj->secrets ?? throw new Exception('No secrets object in file.');
        }
        catch (Exception $e)
        {
            echo 'Error: ' . $e->getMessage();
            exit;
        }
    }

    private function setSecrets() {
        try {
            $secrets = $this->readSecrets();

            if (isset($secrets->database->sources[$secrets->database->id])) {
                $db = $secrets->database->sources[$secrets->database->id];
                
                $this->dbDSN = $db->dsn;
                $this->dbUser = $db->user;
                $this->dbPass = $db->pass;
                $this->dbSchema = $db->schema;
            }

            $GLOBALS['mastodon_host'] = $secrets->mastodon->host ?: throw new Exception('Mastodon hostname not specified.');
            $GLOBALS['mastodon_user'] = $secrets->mastodon->user ?: throw new Exception('Mastodon user not specified.');
            $GLOBALS['mastodon_token'] = $secrets->mastodon->token ?: throw new Exception('Mastodon access token not provided');
        }
        catch (Exception $e) {
            echo 'Error: ' . $e->getMessage();
            exit;
        }
    }

    public function buildRoutes(array $pagePaths) {
        $this->pageRoutes = [];
       
        foreach ($pagePaths as $path) {
            /** @var PagePath $path */
            $id = $path->id;
            $fullPath = $path->pathPart;

            while ($path->parentId) {
                $path = $pagePaths[$path->parentId];
                $fullPath = $path->pathPart . DIRECTORY_SEPARATOR . $fullPath;
            }

            $this->pageRoutes[$id] = $fullPath;
        }
    }

    function setPageTitle(string $pageTitle) {
        $this->pageTitle = $pageTitle . ' – ' . SITE_TITLE;
    }
}

?>