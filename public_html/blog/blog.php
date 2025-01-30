<?php
    require_once('./includes/utilities/database.php');

    setPageTitle('Blog');
    setCopyrightYearByFile(__FILE__);
?>

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
    <script>
        const output = document.querySelector('main');
        const template = output.querySelector('template');

        fetch('/api/blog/posts')
            .then(response => {
                if (!response.ok)
                    throw new Error('API call failed')

                return response.json();
            })
            .then(data => {
                data.forEach(post => {
                    const cloneNode = template.content.cloneNode(true);
                    cloneNode.querySelector('section > h2').innerHTML = `<a href="/blog${post.permalink}">` + post.title + '</a>';
                    cloneNode.querySelector('section-byline').textContent = post.created_on;
                    cloneNode.querySelector('section-content').innerHTML = post.content + (post.content.match('(.*(?<=<!--[ ]*SPLIT[ ]*-->))') ? 'Read more...' : '');

                    output.appendChild(cloneNode);
                });
            })
            .catch(error => console.log(error));
    </script>
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
<!-- 
    0) Using threaded toots is more trouble than it's worth, so nevermind that
    1) Replace Fontawesome dependency with a couple of custom SVGs or something
    2) Fix up the CSS and markup generation to better fit the site's design
    3) Find a way to use Mastodon's API to post the toot and save its id as the blog post is generated
-->
<mastodon-comments host="mastodon.gamedev.place" user="jedimb" tootId="113056844680690229" style="width: min(100%, 600px);"></mastodon-comments>