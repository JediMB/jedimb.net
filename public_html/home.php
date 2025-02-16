<?php
    setPageTitle('Home');
    setCopyrightYearByFile(__FILE__);
?>

<page-content class="md:grid grid-cols-sidebar-right gap-x-8">
    <main class="mb-3">
        <h2>So,<span style="font-size: 0.5em"> </span>why are we here?</h2>
        <p>
            It's honestly difficult to come up with something to put here. I've just been staring at the screen,
            adjusting the padding and margins, tweaking font sizes, etc., and maybe that's also why I'm terrible
            with job applications and interviews.
        </p>
        <div>
            Anyway, the idea for this site was that I wanted...
            <ol class="numbered">
                <li>...a way to learn more PHP and refresh what I learned a year ago (in early 2024).</li>
                <li>...a place to showcase future code projects, like small games.</li>
                <li>...to see if I could come up with a way to make my PHP experience more similar to web app frameworks like Angular.</li>
                <li>EDIT: ...to make a really dorky menu button for the mobile view, apparently!</li>
            </ol>
        </div>
        <p>
            See that list? I could have just gone with a regular ordered list, but instead I spent time on making it all fancy-like
            <em class="weak">(including hover effects)</em> and lost track of what I was going to type here.
            <em class="weak">Hopeless!</em>
        </p>
        <p><em>Anyway...!</em></p>
        <p>
            Nothing in the menu actually links anywhere real yet. The menu items are just there for testing purposes
            until the website is in a finished enough state that I can remove them and actually start working on content.
        </p>
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