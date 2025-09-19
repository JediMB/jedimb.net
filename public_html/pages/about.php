<?php

use Services\PageService;

PageService::getInstance()->setTitle('About me');
setCopyrightYearByFile(__FILE__);

?>

<page-content>
    <main>
        <h2>About me</h2>
        <p>
            I'm a Swedish 🇸🇪 programmer <em>(<a href="https://cv.jedimb.net" target="_blank">actively looking for work</a>)</em>
            with a passion for coding that, after a burnout episode in the past, I've thankfully been able to reignite and nurture in recent years.
            Being born and raised in and around Gävle, Sweden, I'm naturally fluent in Swedish, but I'm comfortable with and tend to default to
            English due to practically growing up on the Internet since my teenage years.
        </p>
        
        <about-me>
            <ul>
                <li>
                    <input type="radio" name="about-me" id="input-pc-and-me" checked>
                    <label for="input-pc-and-me">PC and Me</label>
                    <template id="about-pc-and-me">
                        <section>
                            <h3>PC and Me</h3>
                            <p>
                                Online or off, I've always been a <i>"computer wiz"</i> who's been quick to adapt to and learn new things. I've used <i>MS-DOS</i>
                                and every major Microsoft Windows home release from <i>Windows 3.1</i> through <i>Windows 10</i>, and assembled or upgraded
                                my own desktop PCs since I was 13 years old. The only reason I didn't upgrade to <i>Windows 11</i> years ago is because I haven't had
                                the means (or need) to upgrade my computer's hardware to meet Microsoft's arbitrary CPU and
                                <i><a href="https://en.wikipedia.org/wiki/Trusted_Platform_Module" target="_blank">TPM 2.0</a></i> requirements.
                            </p>
                            <p>
                                But why not turn that misfortune into an opportunity to try something else instead?
                            </p>
                            <p>
                                Since December 7, 2024, I've practically speaking been a full-time Linux user. While I'm not opposed to using Windows
                                operating systems and keep my old installation on a separate partition for when I might need to boot into it, I've gained a
                                growing appreciation for <i><a href="https://en.wikipedia.org/wiki/Free_and_open-source_software" target="_blank">FOSS</a></i>
                                in recent years. At the moment, I'm using the very convenient <i>Debian 12</i> on my desktop PC while a home server I maintain
                                runs the Debian edition of <i>Linux Mint.</i> In September of 2025, my trusty old work/gaming laptop joined in with a fresh
                                install of <i>Debian 13</i> ahead of an internship.
                            </p>
                            <p>
                                Presumably I'll switch to <i>Arch Linux</i> at some point in the future, but right now I have other things to focus on.
                            </p>
                        </section>
                    </template>
                </li>
                
                <li>
                    <input type="radio" name="about-me" id="input-coding-pt-1">
                    <label for="input-coding-pt-1">Coding, Pt. 1</label>
                    <template id="about-coding-pt-1">
                        <section>
                            <h3>Coding, Pt. 1</h3>
                            <p>
                                While not programming per se, I had my first encounter with HTML and CSS as a child in 1997, when a fresh, new computer magazine called
                                <i><a href="https://sv.wikipedia.org/wiki/PC_f%C3%B6r_alla" target="_blank">PC för alla</a></i> (lit. "PC for everyone") included tutorials
                                and tips on the basics of both, at a time when CSS in particular was something brand new and exciting (but with no best practices).
                                Subsequently, I set up a free website on Angelfire that I briefly used to host fanfiction, before getting my account shut down for bypassing
                                their off-site linking restrictions. 🤷🏻‍♀️
                            </p>
                            <p>
                                It was very much a different time.
                            </p>
                            <p>
                                During my upper secondary education, focused on computer technology, I got to dip into actual programming, although further experience
                                showed me just how disorganized and inadequate that course was. We learned some basics of <nobr>C++</nobr>, Visual Basic and Java, and then
                                a few of us moved on to make a side-scrolling space <i><a href="https://en.wikipedia.org/wiki/Shoot_%27em_up" target="_blank">shmup</a></i>
                                using <nobr>C++</nobr> and a DirectX wrapper. There were a lot of very obvious gaps in our knowledge, though.
                            </p>
                            <p>
                                Amusingly, my most vivid memory of all of this was one of the teachers pointing at the code he'd written on a whiteboard, stating that
                                <i>"this is a pointer"</i> and giving no elaboration on what a pointer even was in the context of programming.
                            </p>
                            <p>
                                As my upper secondary education ended, I was... tired, to say the least. I wanted to take a year off from studying to focus on something
                                else, but a classmate convinced me to come along for an interview at a school focused in video game development. While I learned a lot,
                                and actually got a better foundation of <nobr>C++</nobr> knowledge, I ended up not being able to keep up and never finished several courses.
                            </p>
                        </section>
                    </template>
                </li>

                <li>
                    <input type="radio" name="about-me" id="input-coding-pt-2">
                    <label for="input-coding-pt-2">Coding, Pt. 2</label>
                    <template id="about-coding-pt-2">
                        <section>
                            <h3>Coding, Pt. 2</h3>
                            <p>
                                A few years and some misadventures in Ireland later, I ended up getting a programming internship at a company in Stockholm. It started out
                                with some quick courses covering C#, web applications, ASP.NET and SQL. In hindsight, I realize many of my problems back then stemmed from
                                the courses just being too short and not covering enough knowledge, but poor communication and sleezy behavior from a person of authority
                                also contributed to an extremely stressful situation that burnt me out and caused me to walk away from the field entirely.
                            </p>
                            <p>
                                That sucked, to be blunt.
                            </p>
                            <p>
                                Fast-forward to the start of 2021. An uninstaller for a defunct indie game storefront deleted the entire game folder on my gaming laptop and
                                messed up a bunch of symbolic links I'd set up to compensate for how partitions were set up in the factory defaults. Using a file recovery
                                tool and letting Steam and the other game installers/launchers  I decided the best course
                                of action was to just back up everything I wanted to keep <em>(documents, save files, music, etc.)</em> and reinstall Windows with
                                repartitioned drives. While going through my files, I realized I had a copy of
                                <i><a href="https://doomwiki.org/wiki/Doom_Builder_2" target="_blank">Doom <nobr>Builder 2</nobr></a></i> that I'd never actually used, and I
                                felt that I wanted to change that.
                            </p>
                            <p>
                                After making my first few <i>Doom II</i> maps in those early months, I joined an online community and usually work on deepening my
                                understanding of modern Doom mapping techniques in the month of June each year, as a part of the recurring
                                <i><a href="https://doomwiki.org/wiki/Rabbit%27s_All-comers_Mapping_Project" target="_blank">RAMP</a></i> community project. I learned the
                                <i><a href="https://doomwiki.org/wiki/ACS" target="_blank">ACS</a></i> script language in 2021, dipped into but ultimately skipped the 2022
                                project as I was moving into a new apartment, and spent much of the 2023 and 2024 mapping time on deepening my knowledge of the
                                <i><a href="https://doomwiki.org/wiki/ZScript" target="_blank">ZScript</a></i> language and libraries that allow for much more custom behaviors
                                and content.
                            </p>
                            <p>
                                I also spend as much time as I can afford on helping others on the community with scripting and programming issues, even when I don't have
                                time to do much mapping for myself.
                            </p>
                            <p>
                                The joy I got from all of this was a part of what pushed me towards renewing and filling in the gaping holes in my web/.NET/full-stack
                                development skills and becoming a certified <i>.NET developer</i>. I learned a lot and, to be honest, was pleasantly surprised by how
                                easy it was to get back into what I left behind all that time ago. Still had to work my butt off to get my projects done and ace those tests,
                                but it felt natural and most of all <em>fun</em>. It kind of hit home how this is what I should have been doing all along, and I took
                                advantage of that by helping my classmates as much as I could by explaining things they had trouble with understanding in small groups or
                                1-on-1, which was also something I enjoyed.
                            </p>
                            <p>
                                Lastly, there was the internship at <i><a href="https://www.knowit.se/" target="_blank">Knowit</a></i> at the tail end of my .NET education.
                                I only have good things to say about that place and its wonderful people, as they were immensely supportive while teaching us <i>(I was there
                                in two groups of four people)</i> much about the realities of how real software development actually works. We continued development of a
                                web app for a figure skating club that helps with managing members, schedules, etc., and essentially got a taste of how it might be to work
                                as a consultant in addition to acquiring experience with both what our courses had covered and previously missing skills like unit testing.
                            </p>
                            <p>
                                The project itself was/is built on a <i>C#</i> backend with <i>Entity Framework Core</i> and an
                                <i><a href="https://angular.dev/" target="_blank">Angular</a></i> frontend using <i>TypeScript</i>.
                            </p>
                            <p>
                                I even got to plan out both the broad strokes and the detail work for a large feature that the entire team worked on at the same time. It was
                                challenging, for sure, but getting through it and succeeding was immensely satisfying. Hopefully getting this experience in a safe environment
                                like this is going to pay off in the long run.
                            </p>
                        </section>
                    </template>
                </li>

                <li>
                    <input type="radio" name="about-me" id="input-coding-supplemental">
                    <label for="input-coding-supplemental">Coding, Supplemental</label>
                    <template id="about-coding-supplemental">
                        <section>
                            <h3>Coding, Supplemental</h3>
                            <p>
                                So, what's next? Well, I'm applying for jobs, of course.
                            </p>
                            <p>
                                But I also want to keep learning. In early 2024, during my <i>Knowit</i> internship, I finally started learning PHP in my free time, and
                                while I had to put that aside to focus on school, the end result is now this website. Aside from using
                                <a href="https://tailwindcss.com/" target="_blank">Tailwind</a> to speed up the design process, everything is coded from scratch with PHP,
                                CSS and JavaScript. No extra frameworks or libraries, although I intend to dip into a few more of those in the future.
                            </p>
                            <p>
                                Since I really enjoyed the component-based architectures of Angular and React, I've spent some time thinking through how I might adapt PHP
                                into smoothly working in a similar manner, and came up with a setup that feels really good to me. I could probably have gotten a lot of this
                                for free if I used a framework like <a href="https://laravel.com/" target="_blank">Laravel</a>, but it was important to me that I went
                                "vanilla" for my first PHP project to better understand how things work.
                            </p>
                            <p>
                                <s>Now that the website is basically in a usable state, the plan is to tweak aspects as necessary while I move on to learn something else.</s>
                            </p>
                            <p>
                                <s>First stop: Java.</s>
                            </p>
                            <p>
                                Or so I thought, back at the end of January. Instead, I ended up getting short-lived employment, and then just had a hard time getting
                                back in that coding groove. As of September 8, 2025, I'm doing an internship with a previous employer. Basically, I'm using this website
                                as a basis for a new and improved site for the company. I get the opportunity to improve my skills without unemployment interference, as
                                well as official work experience, and they get a new website with a better user experience out of it.
                            </p>
                            <p>
                                It's a win-win situation, I think, and at the time of typing <i>(two weeks in)</i>, I've honestly made some enormous improvements to the code base.
                            </p>
                        </section>
                    </template>
                </li>
            </ul>

            <about-me-content>

            </about-me-content>
        </about-me>

        <script>
            const inputs = Array.from(document.querySelectorAll('input[name="about-me"]'));
            const destination = document.querySelector('about-me-content');

            inputs.forEach(input => {
                input.addEventListener('change', () => {
                    destination.replaceChildren(
                        input.parentElement.querySelector('template')?.content.cloneNode(true)
                    );
                });

                if (input.checked)
                    destination.replaceChildren(
                        input.parentElement.querySelector('template')?.content.cloneNode(true)
                    );
            });
        </script>
    </main>
</page-content>