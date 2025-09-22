<?php

use Services\PageService;

PageService::getInstance()->setTitle('Blog');
setCopyrightYearByFile(__FILE__);

?>

<script type="module" defer src="/js/pages/blog.blog.js"></script>

<page-content class="md:grid grid-cols-sidebar-right gap-x-8">
    <main class="mb-3">
        <!-- Implement pagination and include the first page as part of the document -->
        <template>
            <article class="flex flex-col">
                <h2><a href="/blog/{id}">Title</a></h2>
                <article-byline>
                    <date-created>6h ago</date-created>
                    <date-modified class="weak">last modified 4h ago</date-modified>
                </article-byline>
                <article-content>Content</article-content>
            </article>
        </template>
    </main>
    <aside class="links max-md:bg-hotpink-950 max-md:p-2 max-md:rounded-lg">
        <?php include 'components/button-links.php' ?>
    </aside>
</page-content>