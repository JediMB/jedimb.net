<?php declare(strict_types=1);

namespace Models\DTO;

require_once 'models/base/db-base.model.php';
require_once 'utilities/input.utility.php';

use Models\Base\DBBase;
use Utilities\DateTime;
use Utilities\Input;

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

        $errors = [];

        $this->title = Input::verifyRequiredTextInput('title', $input['title'], INPUT_LENGTH['page_title'], $errors, REGEX_PHP['default-text']);
        $this->description = Input::verifyRequiredTextInput('description', $input['description'], INPUT_LENGTH['page_description'], $errors, REGEX_PHP['default-text']);
        
        $this->contentShort = strip_tags($input['contentShort'], INPUT_ALLOWED_TAGS);
        
        $this->contentRest = empty($input['contentRest'])
            ? null
            : strip_tags($input['contentRest'], INPUT_ALLOWED_TAGS) ;

        $this->mastolink = $input['mastolink'];
        $this->isPinned = $input['isPinned'];
        $this->scheduledOn = DateTime::parse($input['scheduledOn']);

        $this->permalink = date('/Y/m/d/', $this->scheduledOn?->getTimestamp()) . $input['permalink'];
    }
}

?>
