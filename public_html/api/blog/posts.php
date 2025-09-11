<?php

require_once 'includes/services/database-service.php';

$input = json_decode(file_get_contents('php://input'), true);

// $params = $GLOBALS['api_params'];

switch( $_SERVER['REQUEST_METHOD'] ) {
    case 'GET':
        try {
            $result = DatabaseService::getInstance()->selectView('blog_posts_published', Fetch::All);
            
            echo json_encode($result);
        }
        catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['error' => 'Invalid request method']);
}

?>