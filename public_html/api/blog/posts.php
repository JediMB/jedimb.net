<?php
    require_once('includes/services/database.php');

    $input = json_decode(file_get_contents('php://input'), true);

    dbConnect();

    switch( $_SERVER['REQUEST_METHOD'] ) {
        case 'GET':
            $params = $GLOBALS['api_params'];
            
            // if ( count($params) > 0 && ( $id = intval($params[0]) ) ) {
            //     dbSelect('blog_post', [], ['id = ' . $id], [], 1);
                
            //     if (($result = dbResultNextRow()))
            //         echo json_encode($result);
            //     else
            //         echo json_encode(['error' => 'Blog post not found.']);

            //     break;
            // }

            dbSelect('blog_post',
                ['id', 'permalink', 'title', "substring(content, '((.*(?<=<!--[ ]*SPLIT[ ]*-->))|^((?!<!--[ ]*SPLIT[ ]*-->).)*$)') as content", 'mastolink', 'created_on', 'modified_on'],
                ['is_published = true']);
            $posts = [];
            while ($post = dbResultNextRow()) {
                $posts[] = $post;
            }
            echo json_encode($posts);
            break;

        default:
            echo json_encode(['error' => 'Invalid request method']);
    }

    dbDisconnect();
?>