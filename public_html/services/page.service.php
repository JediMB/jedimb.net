<?php

namespace Services;

require_once 'services/singleton.php';
require_once 'services/database.service.php';
require_once 'models/page.model.php';
require_once 'models/page-navigation-data.model.php';

use Models\Page;
use PDOException;

class PageService extends Singleton {
    public string $id;
    public string $title;
    public string $template;
    public string $year;
    public string $content;

    protected function __construct() {
        $this->title = SITE_TITLE;
        $this->template  = realpath('views/' . PATH_TEMPLATE_DEFAULT);
        $this->year = SITE_CREATEDYEAR;
        $this->content = 'Page content';
    }

    public function getPage(int $id) : Page|false {
        try {
            $page = DatabaseService::getInstance()->selectById(
                'page', $id
            );
        }
        catch (PDOException $e) {
            $page['id'] = $id;
            $page['page_title'] = 'Error';
            $page['content'] = $e->getMessage();
        }
        finally {
            if ($page)
                return new Page($page);

            return false;
        }
    }

    public function setTitle(string $pageTitle) {
        $this->title = $pageTitle . ' – ' . SITE_TITLE;
    }
}

?>