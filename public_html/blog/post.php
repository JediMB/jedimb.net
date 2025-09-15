<?php

require_once 'includes/services/blog/blog-post-service.php';
require_once 'includes/models/blog-post.php';

use Services\BlogPostService;

if ( !( $post = BlogPostService::getInstance()->getBlogPost($GLOBALS['permalink']) ) ) {
    include 'includes/errors/404.php';
    return;
}
/** @var BlogPost $post */

Configuration::getInstance()->setPageTitle($post->title);
setCopyrightYearByFile(__FILE__);

?>

<script type="text/javascript" defer src="/js/pages/blog.post.js"></script>

<page-content>
    <main>
        <h2><?=$post->title?></h2>
        <div>
            <?php

            $createdOn = $post->createdOn->format('Y-m-d H:i:s');

            echo <<<HTML
                <span><date-time server-time="{$createdOn}" class="capitalize">{$createdOn}</date-time></span>
            HTML;

            if ($post->modifiedOn) {
                $modifiedOn = $post->modifiedOn->format('Y-m-d H:i:s');

                echo <<<HTML
                    <span class="weak">- Last modified <date-time server-time="{$modifiedOn}">{$modifiedOn}</date-time>.</span>
                HTML;
            }

            ?>
        </div>
        <?=$post->content?>
    </main>
    <!-- 
        1) Replace Fontawesome dependency with a couple of custom SVGs or something
        2) Find a way to use Mastodon's API to post the toot and save its id as the blog post is generated
        3) Move mastolink regex string to configuration?
    -->
    <?php

    $matches = [];
    if ($post->mastolink && preg_match('/^http[s]?:\/\/([-.a-z0-9]+)\/@([-.a-z0-9]+)\/([0-9]+)$/', $post->mastolink, $matches)) {
        echo <<<HTML
            <mastodon-comments host="{$matches[1]}" user="{$matches[2]}" tootId="{$matches[3]}"></mastodon-comments>
        HTML;
    }
    
    ?>
</page-content>