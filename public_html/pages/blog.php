<?php ?>

<script type="module" src="/js/pages/blog.blog.js"></script>

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