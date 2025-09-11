<?php

$input = json_decode(file_get_contents('php://input'), true);

// $params = $GLOBALS['api_params'];

switch( $_SERVER['REQUEST_METHOD'] ) {
    case 'GET':
        try {
            $connection = new PDO(
                $GLOBALS['db_dsn'],
                $GLOBALS['db_user'],
                $GLOBALS['db_pass'],
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
            $schema = $GLOBALS['db_schema'];

            $query = $connection->prepare("SELECT * FROM $schema.blog_posts_published");
            $query->execute();

            echo json_encode($query->fetchAll());
        }
        catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        finally {
            $connection = null;
        }
        break;

    default:
        echo json_encode(['error' => 'Invalid request method']);
}

?>