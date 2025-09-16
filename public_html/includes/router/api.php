<?php

// If it's an api call, handle separately
function handleApiRequests(string $path) {
    if (strpos($path, 'api/') === 0) {
        header('Content-Type: application/json');

        $requestComponents = explode(DIRECTORY_SEPARATOR, $path, 10);
        
        $apiPath = $requestComponents[0];
        for ($i = 1; $i < count($requestComponents); $i++) {
            $apiPath = $apiPath . DIRECTORY_SEPARATOR . $requestComponents[$i];

            // If a matching api file is found, serve it as a json string
            if (($filePath = realpath($apiPath . '.php'))) {
                $GLOBALS['api_params'] = array_slice($requestComponents, $i + 1);
                include $filePath;
                exit;
            }
        }

        echo json_encode(['message' => 'Invalid URI']);
        exit;
    }
    
}

?>