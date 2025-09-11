<?php

function readConfiguration() {
    $fileName = '.configuration.json';

    if ( is_file($fileName) == false )
        return null;

    $jsonFile = fopen($fileName, 'r');
    $jsonObj = fread($jsonFile, filesize($fileName));
    fclose($jsonFile);

    $obj = json_decode($jsonObj);
    
    if (isset($obj->configuration))
        return $obj->configuration;

    return null;
}

function setConfiguration() {
    try {
        $config = readConfiguration();
        $GLOBALS['configuration'] = $config ?? throw new Exception('No configuration found.');

        $GLOBALS['site_author'] = $config->author ?: throw new Exception('Author unspecified.');
        $GLOBALS['page_title'] = $GLOBALS['site_title'] = $config->title ?: throw new Exception('Title unspecified.');
        $GLOBALS['page_template'] = realpath('includes/views/' . $config->defaultTemplate) ?: throw new Exception('No valid template specified.');
        $GLOBALS['site_home'] = realpath($config->home) ?: throw new Exception('No valid home document specified.');
        $GLOBALS['page_year'] = $config->creationYear ?: throw new Exception('Creation year unspecified.');
        $GLOBALS['page_content'] = 'Page content';
    }
    catch (Exception $e) {
        echo 'Error: Invalid website configuration.<br />' . $e->getMessage();
        exit;
    }
}

function readSecrets() {
    try {
        if (isset($GLOBALS['configuration']) === false)
            throw new Exception('Configuration not set when attempting to read secrets.');

        $secretsPath = $GLOBALS['configuration']->secrets ?: throw new Exception('Secrets path unspecified.');

        ($secretsPath = realpath($secretsPath)) ?: throw new Exception('Secrets not found.');

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

function setSecrets() {
    try {
        $secrets = readSecrets();

        /*
            Since these should be optional features, configuration should determine if
            the variables should be set to begin with and the components that use them
            should throw errors if they're not set.
        */
        
        //$GLOBALS['pepper'] = $secrets->pepper ?: throw new Exception('No pepper found.');

        $db = $secrets->database->sources[$secrets->database->id];
        $GLOBALS['db_connection_string'] =
            'host=sql710.your-server.de' .
            ' dbname=jedimb_db1' . 
            ' user=' . $db->user .
            ' password=' . $db->pass;
        $GLOBALS['db_dsn'] = $db->dsn;
        $GLOBALS['db_schema'] = $db->schema;
        $GLOBALS['db_user'] = $db->user;
        $GLOBALS['db_pass'] = $db->pass;

        $GLOBALS['mastodon_host'] = $secrets->mastodon->host ?: throw new Exception('Mastodon hostname not specified.');
        $GLOBALS['mastodon_user'] = $secrets->mastodon->user ?: throw new Exception('Mastodon user not specified.');
        $GLOBALS['mastodon_token'] = $secrets->mastodon->token ?: throw new Exception('Mastodon access token not provided');
    }
    catch (Exception $e) {
        echo 'Error: ' . $e->getMessage();
        exit;
    }
}

function setPageTitle(string $pageTitle) {
    $GLOBALS['page_title'] = $pageTitle . ' - ' . $GLOBALS['site_title'];
}

?>