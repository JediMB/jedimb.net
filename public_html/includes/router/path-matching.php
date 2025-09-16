<?php
    function handlePathMatching(string $path, bool &$isForbidden) : string|false {
        /*  Try to find a matching file in the following order:
        1) Perfect match
        2) File with php extension
        3) File with html extension
        4) Directory with index.php
        5) Directory with index.html
        */
        $isForbidden = false;
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

            if ( ( $realPath = realpath($path . $pathSuffix) ) === false )
                continue;

            if ( is_dir($realPath) ) {
                // Trying to access a directory without an index file
                $isForbidden = true;
                continue;
            }
            
            $isForbidden = false;
            break;
        }

        return $realPath;
    }
?>