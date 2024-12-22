<?php
    function configData() {
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
?>