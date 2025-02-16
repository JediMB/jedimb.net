<?php

    chdir(__DIR__);
    
    require_once './includes/utilities/configuration.php';
    require_once './includes/utilities/copyright-year.php';

    setConfiguration();
    setSecrets();

    // Remove slashes and dots from start and query string from end of path
    $requestPath = parse_url(ltrim($_SERVER['REQUEST_URI'], '/.'), PHP_URL_PATH);
    

    // If it's an api call, handle separately
    if (strpos($requestPath, 'api/') === 0) {
        header('Content-Type: application/json');

        $requestComponents = explode(DIRECTORY_SEPARATOR, $requestPath, 10);
        
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

    // If it's trying to access a blog entry, serve a match
    $matches = [];
    if (preg_match('/^blog(\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[-a-z0-9]*)$/', $requestPath, $matches)) {
        $GLOBALS['permalink'] = $matches[1];
        ob_start();
        include 'blog/post.php';
        $GLOBALS['page_content'] = ob_get_clean();
        require_once $GLOBALS['page_template'];
        exit;
    }

    // If it's a root request, serve root/home.php
    if ($requestPath === '')
        $requestPath = $GLOBALS['site_home'];

    /*  Try to find a matching file in the following order:
        1) Perfect match
        2) File with php extension
        3) File with html extension
        4) Directory with index.php
        5) Directory with index.html
    */
    $error403 = false;
    foreach (
        [
            '',
            '.php',
            '.html',
            DIRECTORY_SEPARATOR . 'index.php',
            DIRECTORY_SEPARATOR . 'index.html'
        ]
        as $pathSuffix
        ) {

        if ( ( $filePath = realpath($requestPath . $pathSuffix) ) === false )
            continue;

        if ( is_dir($filePath) ) {
            $error403 = true;
            continue;
        }
        
        $error403 = false;
        break;
    }

    // Check if trying to access a PHP or disallowed file
    $isPHP = (strtolower(substr($filePath, -4)) === '.php');

    if ($isPHP) {
        $httpUserAgent = strtolower($_SERVER['HTTP_USER_AGENT']);

        foreach([
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
        ] as $botAgent)
        {
            if (strpos($httpUserAgent, $botAgent) !== false) {
                $error404 = true;
                break;
            }
        }
    }

    $error404 ??=
        strtolower($requestPath) === 'index'
        || strtolower($requestPath) === 'index.php'
        || strpos($filePath, __DIR__ . DIRECTORY_SEPARATOR) !== 0 
        || $filePath === __FILE__
        || substr(basename($filePath), 0, 1) === '.'
        || ( $isPHP && strpos($requestPath, 'includes/') === 0 );

    // Serve error 403 if trying to access a directory without an index file to serve
    if ($error403) {
        header('HTTP/1.1 403 Forbidden');

        ob_start();
        include 'includes/errors/403.php';
        $GLOBALS['page_content'] = ob_get_clean();
        require_once $GLOBALS['page_template'];
        exit;
    }

    // Serve error 404 if trying to access a disallowed file
    if ($error404) {
        header('HTTP/1.1 404 Not Found');

        ob_start();
        include 'includes/errors/404.php';
        $GLOBALS['page_content'] = ob_get_clean();
        require_once $GLOBALS['page_template'];
        exit;
    }

    // Serve PHP file through interpreter
    if ($isPHP) {
        ob_start();
        include $filePath;
        $GLOBALS['page_content'] = ob_get_clean();
        require_once $GLOBALS['page_template'];
        exit;
    }

    // Serve asset file from filesystem
    return false;

?>