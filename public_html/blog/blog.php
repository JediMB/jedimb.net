<?php

require_once 'includes/services/database.php';

setPageTitle('Blog');
setCopyrightYearByFile(__FILE__);

?>

<script type="module" defer src="/js/pages/blog.blog.js"></script>

<page-content class="md:grid grid-cols-sidebar-right gap-x-8">
    <main class="mb-3">
        <!-- Implement pagination and include the first page as part of the document -->
        <template>
            <section class="flex flex-col">
                <h2><a href="/blog/{id}">Title</a></h2>
                <section-byline>6h ago - last modified 4h ago</section-byline>
                <section-content>Content</section-content>
            </section>
        </template>
    </main>
    <aside class="links max-md:bg-hotpink-950 max-md:p-2 max-md:rounded-lg">
        <h2>Links</h2>
        <div class="mb-3">
            Cool people and places in 88 × 31 pixels:
        </div>
        <div class="flex gap-3 px-2
            max-md:flex-row max-md:justify-center max-md:flex-wrap
            md:flex-col md:items-center">
            <a href="https://enikofox.com" title="Eniko does bad things to code" target="_blank">
                <img src="https://enikofox.com/enikodoesbadthingstocode.png" width="88" height="31" alt="Eniko does bad things to code">
            </a>
        </div>
        <div class="mt-3 text-gray-500 italic">
            I'll make my own button at some point, too!
        </div>
    </aside>
</page-content>