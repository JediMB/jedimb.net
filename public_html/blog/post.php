<?php
    require_once('./includes/utilities/database.php');

    dbConnect();

    dbSelect('blog_post', [], ['permalink = \'' . $GLOBALS['permalink'] . '\''], [], 1);
    $row = dbResultNextRow();

    dbDisconnect();

    if(!$row) {
        include 'includes/errors/404.php';
        return;
    }

    setPageTitle($row['title']);
    setCopyrightYearByFile(__FILE__);
?>

<page-content>
    <main>
        <h2><?=$row['title']?></h2>
        <div>
            <?php
                /*
                    1) Do datetime parsing
                    2) Timezone conversion
                    3) Print "now" or "yesterday", etc., when appropriate
                    4) Maybe adapt the date and/or time to the user locale?
                */
                echo <<<HTML
                    <span>{$row['created_on']}</span>
                HTML;

                if ($row['modified_on']) {
                    echo <<<HTML
                        <span class="weak">- Last modified on {$row['modified_on']}.</span>
                    HTML;
                }
            ?>
        </div>
        <?=$row['content']?>
    </main>
    <!-- 
        1) Replace Fontawesome dependency with a couple of custom SVGs or something
        2) Find a way to use Mastodon's API to post the toot and save its id as the blog post is generated
    -->
    <?php
        $matches = [];
        if (preg_match('/^http[s]?:\/\/([-.a-z0-9]+)\/@([-.a-z0-9]+)\/([0-9]+)$/', $row['mastolink'], $matches)) {
            echo <<<HTML
                <mastodon-comments host="{$matches[1]}" user="{$matches[2]}" tootId="{$matches[3]}"></mastodon-comments>
            HTML;
        }
    ?>
</page-content>