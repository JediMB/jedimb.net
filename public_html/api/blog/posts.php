<?php
    require_once('./includes/utilities/database.php');

    $input = json_decode(file_get_contents('php://input'), true);

    dbConnect();

    switch( $_SERVER['REQUEST_METHOD'] ) {
        case 'GET':
            $params = $GLOBALS['api_params'];
            
            if ( count($params) > 0 && ( $id = intval($params[0]) ) ) {
                dbSelect('blog_post', [], ['id = ' . $id], [], 1);
                // Handle not finding a match
                echo json_encode(dbResultNextRow());
                break;
            }

            dbSelect('blog_post', ['id', 'permalink', 'title', "substring(content, '((.*(?<=<!--[ ]*SPLIT[ ]*-->))|^((?!<!--[ ]*SPLIT[ ]*-->).)*$)') as content", 'mastolink', 'created_on', 'modified_on']);
            $posts = [];
            while ($post = dbResultNextRow()) {
                $posts[] = $post;
            }
            echo json_encode($posts);
            break;

        default:
            echo json_encode(['message' => 'Invalid request method']);
    }

    dbDisconnect();
?>