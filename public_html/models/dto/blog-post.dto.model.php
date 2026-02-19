<?php declare(strict_types=1);

namespace Models\DTO;

require_once 'models/base/db-page-content.model.php';

use Models\Base\DBPageContent;

class BlogPost extends DBPageContent {
    public string $permalink;
    public ?string $mastolink;
    public bool $isPinned;
    public ?\DateTime $scheduledOn;

    public function __construct(array $input) {
        parent::__construct($input);

        $this->permalink = $input['permalink'];
        $this->mastolink = $input['mastolink'];
        $this->isPinned = $input['isPinned'];

        // TODO: Proper conversion from nullable string to nullable DateTime
        $this->scheduledOn = $input['scheduledOn'];
    }
}

?>
