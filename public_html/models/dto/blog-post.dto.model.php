<?php declare(strict_types=1);

namespace Models\DTO;

require_once 'models/base/db-base.model.php';

use Models\Base\DBBase;
use Utilities\DateTime;

class BlogPost extends DBBase {
    public string $permalink;
    public string $title;
    public string $description;
    public string $contentShort;
    public ?string $contentRest;
    public ?string $mastolink;
    public bool $isPinned;
    public ?\DateTime $scheduledOn;

    public function __construct(array $input) {
        parent::__construct($input);

        $this->permalink = $input['permalink'];
        $this->title = $input['title'];
        $this->description = $input['description'];
        $this->contentShort = $input['contentShort'];
        $this->contentRest = $input['contentRest'];
        $this->mastolink = $input['mastolink'];
        $this->isPinned = $input['isPinned'];
        $this->scheduledOn = DateTime::Parse($input['scheduledOn']);
    }
}

?>
