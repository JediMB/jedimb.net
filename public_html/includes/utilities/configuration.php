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

            $jsonFile = fopen($secretsPath, 'r');
            $jsonObj = fread($jsonFile, filesize($secretsPath));
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

    function setPageTitle(string $pageTitle) {
        $GLOBALS['page_title'] = $pageTitle . ' - ' . $GLOBALS['site_title'];
    }
?>