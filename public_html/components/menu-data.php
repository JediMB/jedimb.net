<?php
    function menuData() {
        $fileName = 'routes.json';

        if ( is_file($fileName) == false )
            return null;

        $jsonFile = fopen($fileName, 'r');
        $jsonObj = fread($jsonFile, filesize($fileName));
        fclose($jsonFile);

        $obj = json_decode($jsonObj);
        
        if ( property_exists($obj, "menu") && is_array($obj->menu))
            return $obj->menu;

        return null;
    }
?>