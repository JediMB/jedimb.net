<?php
    setPageTitle('Blog');
    setCopyrightYearByFile(__FILE__);
?>

<page-content class="md:grid grid-cols-sidebar-right gap-x-8">
    <main class="mb-3">
        <?php
            $dbInfo = readSecrets()->database;
            $db = $dbInfo->sources[$dbInfo->id];

            $dbConnection = pg_connect('host=' . $db->host . ' dbname=' . $db->name . ' user=' . $db->user . ' password=' . $db->pass)
                or die('Could not connect: ' . pg_last_error());

            $query = 'SELECT * FROM jedimb_net.blog_post';
            $result = pg_query($dbConnection, $query) or die('Query failed: ' . pg_last_error());

            echo '<table>';
            while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                echo '<tr>';
                foreach ($line as $colValue) {
                    echo '<td>' . $colValue . '</td>';
                }
                echo '</tr>';
            }
            echo '</table>';

            pg_free_result($result);

            pg_close($dbConnection);
        ?> 
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