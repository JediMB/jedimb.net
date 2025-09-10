<?php

require_once 'includes/services/blog/blog-post-service.php';

if ( !( $post = BlogPostService::getInstance()->getBlogPost($GLOBALS['permalink']) ) ) {
    include 'includes/errors/404.php';
    return;
}

setPageTitle($post['title']);
setCopyrightYearByFile(__FILE__);

?>

<script type="text/javascript" defer src="/js/pages/blog.post.js"></script>

<page-content>
    <main>
        <h2><?=$post['title']?></h2>
        <div>
            <?php

            if (isset($post['created_on'])) {
                echo <<<HTML
                    <span><date-time server-time="{$post['created_on']}" class="capitalize">{$post['created_on']}</date-time></span>
                HTML;
            }

            if (isset($post['modified_on']) && $post['modified_on']) {
                echo <<<HTML
                    <span class="weak">- Last modified <date-time server-time="{$post['modified_on']}">{$post['modified_on']}</date-time>.</span>
                HTML;
            }

            ?>
        </div>
        <?=$post['content']?>
    </main>
    <!-- 
        1) Replace Fontawesome dependency with a couple of custom SVGs or something
        2) Find a way to use Mastodon's API to post the toot and save its id as the blog post is generated
        3) Move mastolink regex string to configuration?
    -->
    <?php

    $matches = [];
    if (isset($post['mastolink']) && preg_match('/^http[s]?:\/\/([-.a-z0-9]+)\/@([-.a-z0-9]+)\/([0-9]+)$/', $post['mastolink'], $matches)) {
        echo <<<HTML
            <mastodon-comments host="{$matches[1]}" user="{$matches[2]}" tootId="{$matches[3]}"></mastodon-comments>
        HTML;
    }
    
    ?>
</page-content>