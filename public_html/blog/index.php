<?php
    require_once('./includes/utilities/database.php');

    setPageTitle('Blog');
    setCopyrightYearByFile(__FILE__);
?>

<page-content class="md:grid grid-cols-sidebar-right gap-x-8">
    <main class="mb-3">
        <template>
            <section class="flex flex-col">
                <a href="/blog/{id}"><h2>Title</h2></a>
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
                console.log(data)
                data.forEach(post => {
                    const cloneNode = template.content.cloneNode(true);
                    cloneNode.querySelector('h2').textContent = 'New Title';
                    cloneNode.querySelector('section-byline').textContent = post.created_on;
                    cloneNode.querySelector('section-content').innerHTML = post.contents;
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