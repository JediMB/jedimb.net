<?php
    require_once('./includes/utilities/database.php');

    /*
        1) Rename 'utilities' to 'services'
        2) Make a services/blog/blog-posts-service.php that handles the logic here
    */
    try {
        dbConnect();
        dbSelectFunction('select_blog_post', [ $GLOBALS['permalink'] ]);
        $row = dbResultNextRow();
    }
    catch(Exception $e) {
        $row['title'] = 'Error';
        $row['content'] = $e->getMessage();
    }
    dbDisconnect();

    if(!$row) {
        include 'includes/errors/404.php';
        return;
    }

    setPageTitle($row['title']);
    setCopyrightYearByFile(__FILE__);
?>

<script type="text/javascript" defer src="/js/pages/blog.post.js"></script>

<page-content>
    <main>
        <h2><?=$row['title']?></h2>
        <div>
            <?php
                if (isset($row['created_on'])) {
                    echo <<<HTML
                        <span><date-time server-time="{$row['created_on']}" class="capitalize">{$row['created_on']}</date-time></span>
                    HTML;
                }

                if (isset($row['modified_on']) && $row['modified_on']) {
                    echo <<<HTML
                        <span class="weak">- Last modified <date-time server-time="{$row['modified_on']}">{$row['modified_on']}</date-time>.</span>
                    HTML;
                }
            ?>
        </div>
        <?=$row['content']?>
    </main>
    <!-- 
        1) Replace Fontawesome dependency with a couple of custom SVGs or something
        2) Find a way to use Mastodon's API to post the toot and save its id as the blog post is generated
        3) Move mastolink regex string to configuration?
    -->
    <?php
        $matches = [];
        if (isset($row['mastolink']) && preg_match('/^http[s]?:\/\/([-.a-z0-9]+)\/@([-.a-z0-9]+)\/([0-9]+)$/', $row['mastolink'], $matches)) {
            echo <<<HTML
                <mastodon-comments host="{$matches[1]}" user="{$matches[2]}" tootId="{$matches[3]}"></mastodon-comments>
            HTML;
        }
    ?>
</page-content>