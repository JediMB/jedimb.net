<?php

require_once 'services/blog-post.service.php';

use Services\BlogPostService;
use Services\PageService;

if ( !( $post = BlogPostService::getInstance()->getBlogPost($GLOBALS['permalink']) ) ) {
    include 'errors/404.php';
    return;
}
/** @var BlogPost $post */

PageService::getInstance()->setTitle($post->title);
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
                    <span class="weak">– Last modified <date-time server-time="{$modifiedOn}">{$modifiedOn}</date-time>.</span>
                HTML;
            }

            ?>
        </div>
        <?=$post->content?>
    </main>
    
    <?php

    $matches = [];
    if ($post->mastolink && preg_match(REGEX_MASTOLINK, $post->mastolink, $matches)) {
        echo <<<HTML
            <svg class="hidden" xmlns="http://www.w3.org/2000/svg">
                <symbol id="svg-mastodon-reply" viewBox="0 0 100 100" fill="inherit">
                    <path d="M8 40L28 20L26.1631 32.8586C26.077 33.461 26.5445 34 27.153 34H80C85.5229 34 90 38.4772 90 44V82H88C82.4771 82 78 77.5228 78 72V46H27.153C26.5445 46 26.077 46.539 26.1631 47.1414L28 60L8 40Z" fill="inherit"/>
                </symbol>
                <symbol id="svg-mastodon-retoot" viewBox="0 0 100 100" fill="inherit">
                    <path d="M92 82C92 87.5228 87.5228 92 82 92L18.7049 92C18.0788 92 17.6067 92.5689 17.7221 93.1843L19 100L5 86L19 72L17.7221 78.8157C17.6067 79.4311 18.0788 80 18.7049 80L80 80V43.1421C80 40.49 81.0536 37.9464 82.9289 36.0711L92 27L92 82Z" fill="inherit"/>
                    <path d="M92 82C92 87.5228 87.5228 92 82 92L18.7049 92C18.0788 92 17.6067 92.5689 17.7221 93.1843L19 100L5 86L19 72L17.7221 78.8157C17.6067 79.4311 18.0788 80 18.7049 80L80 80V43.1421C80 40.49 81.0536 37.9464 82.9289 36.0711L92 27L92 82Z" fill="inherit"/>
                    <path d="M8 18C8 12.4772 12.4772 8 18 8H81.2951C81.9212 8 82.3933 7.43113 82.2779 6.81571L81 0L95 14L81 28L82.2779 21.1843C82.3933 20.5689 81.9212 20 81.2951 20H20V56.8579C20 59.51 18.9464 62.0536 17.0711 63.9289L8 73V18Z" fill="inherit"/>
                    <path d="M8 18C8 12.4772 12.4772 8 18 8H81.2951C81.9212 8 82.3933 7.43113 82.2779 6.81571L81 0L95 14L81 28L82.2779 21.1843C82.3933 20.5689 81.9212 20 81.2951 20H20V56.8579C20 59.51 18.9464 62.0536 17.0711 63.9289L8 73V18Z" fill="inherit"/>
                </symbol>
                <symbol id="svg-mastodon-favorite" viewBox="0 0 100 100" fill="inherit">
                    <path d="M51 3.74001L63.2 38.29L98.5528 38.2892L69.2 59.62L80.3893 94.1909L51 72.84L21.6107 94.1909L32.85 59.62L3.44717 38.2892L39.8 38.29L51 3.74001Z" fill="inherit"/>
                    <path d="M50.0942 32.0095C50.3891 31.0998 51.67 31.0832 51.9884 31.9849L57.1059 46.4767L71.7076 46.4764C72.6763 46.4764 73.0791 47.7159 72.2955 48.2854L60.1064 57.1428L64.756 71.5078C65.0541 72.4288 64.0001 73.1938 63.2169 72.6248L51.005 63.7535L38.7987 72.6208C38.0149 73.1901 36.9604 72.4238 37.2599 71.5025L41.9286 57.1428L29.7194 48.2858C28.935 47.7168 29.3375 46.4764 30.3066 46.4764L45.4042 46.4767L50.0942 32.0095Z" fill="none"/>
                </symbol>
            </svg>
            <mastodon-comments host="{$matches[1]}" user="{$matches[2]}" tootId="{$matches[3]}"></mastodon-comments>
        HTML;
    }
    
    ?>
</page-content>