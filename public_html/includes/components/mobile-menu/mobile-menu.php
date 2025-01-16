<?php
    function mobileMenu(?array $menu) {
        if (!$menu) return;

        $unsuffixedComponentPath = rtrim(__FILE__, 'php');
        $cssPath = realpath($unsuffixedComponentPath . 'css');
        $jsPath = realpath($unsuffixedComponentPath . 'js')
            ? substr($unsuffixedComponentPath, strlen(getcwd())) . 'js'
            : false;

        echo $cssPath ? '<style type="text/css">' . file_get_contents($cssPath) . '</style>' : null;
        echo $jsPath ? '<script src="'. $jsPath . '" defer></script>' : null;

        $onClick = onClick('toggleMobileMenu();');
        $onReturnKey = onReturnKey('this.click();');

        echo <<<HTML
            <nav id="mobile-menu">

                <button id="mobile-menu-button" {$onClick}>
                    <svg width="4rem" height="4rem" viewBox="0 -10 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M64 60H94C95.1046 60 96 60.8954 96 62V74C96 75.1046 95.1046 76 94 76H64V60Z" fill="white"/>
                        <path d="M0 68C0 63.5817 3.58172 60 8 60H69V76H8C3.58172 76 0 72.4183 0 68V68Z" fill="white"/>
                        <path d="M27 30H88C92.4183 30 96 33.5817 96 38V38C96 42.4183 92.4183 46 88 46H27V30Z" fill="white"/>
                        <path d="M0 32C0 30.8954 0.895431 30 2 30H32V46H2C0.895431 46 0 45.1046 0 44V32Z" fill="white"/>
                        <path d="M64 0H94C95.1046 0 96 0.895431 96 2V14C96 15.1046 95.1046 16 94 16H64V0Z" fill="white"/>
                        <path d="M0 8C0 3.58172 3.58172 0 8 0H69V16H8C3.58172 16 0 12.4183 0 8V8Z" fill="white"/>
                    </svg>
                </button>

                <ul id="mobile-menu-contents" class="hidden">
                    <li><a href="/">Home</a></li>
        HTML;

        foreach ($menu as $menuItem) {
            try {
                echo <<<HTML
                    <li>
                        $menuItem->title
                HTML;

                if (isset($menuItem->submenu) && is_array($menuItem->submenu)) {
                    echo '<ul>';

                    foreach (($menuItem->submenu) as $submenuItem) {
                        echo <<<HTML
                            <li>
                                $submenuItem->title
                            </li>
                        HTML;
                    }

                    echo '</ul>';
                }

                echo <<<HTML
                    </li>
                HTML;
            }
            catch(Exception)
            {
                continue;
            }
        }

        echo <<<HTML
                </ul>
            </nav>
        HTML;
    }
?>