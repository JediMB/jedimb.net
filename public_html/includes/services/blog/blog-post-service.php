<?php

require_once 'includes/services/singleton.php';

class BlogPostService extends Singleton {
    public function getBlogPost(string $permalink) {
        try {
            $connection = new PDO(
                $GLOBALS['db_dsn'],
                $GLOBALS['db_user'],
                $GLOBALS['db_pass'],
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
            $schema = $GLOBALS['db_schema'];

            $query = $connection->prepare("SELECT * FROM $schema.select_blog_post('$permalink')");
            $query->execute();

            $post = $query->fetch();
        }
        catch (PDOException $e) {
            $post['title'] = 'Error';
            $post['content'] = $e->getMessage();
        }
        finally {
            $connection = null;
        }

        return $post;
    }
}

?>