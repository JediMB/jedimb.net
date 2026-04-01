<?php declare(strict_types=1);

namespace Models\DTO;

require_once 'models/base/db-base.model.php';
require_once 'models/exceptions/input-exception.php';
require_once 'utilities/datetime.utility.php';
require_once 'utilities/input.utility.php';

use InvalidArgumentException;
use Models\Base\DBBase;
use Models\Exceptions\InputException;
use Utilities\DateTime;
use Utilities\Input;

class BlogPost extends DBBase {
    public string $permalink;
    public string $title;
    public string $description;
    public string $contentShort;
    public ?string $contentRest;
    public ?string $mastolink;
    public bool $isHidden;
    public bool $isPinned;
    public ?string $scheduledOn;

    public function __construct(array $input) {
        parent::__construct($input);

        $errors = [];

        $this->title = Input::verifyRequiredTextInput('title', $input, INPUT_LENGTH['page_title'], $errors, REGEX_PHP['default-text']);
        $this->description = Input::verifyRequiredTextInput('description', $input, INPUT_LENGTH['page_description'], $errors, REGEX_PHP['default-text']);
        
        $this->contentShort = strip_tags($input['contentShort'], INPUT_ALLOWED_TAGS);
        
        $this->contentRest = empty($input['contentRest'])
            ? null
            : strip_tags($input['contentRest'], INPUT_ALLOWED_TAGS);

        $this->mastolink = Input::verifyOptionalTextInput('mastolink', $input, INPUT_LENGTH['page_sociallink'], $errors, REGEX_PHP['url']);

        $this->isPinned = $input['isPinned'];
        $this->isHidden = $input['isHidden'];
        $this->scheduledOn = $input['scheduledOn'];

        $this->permalink = DateTime::toPermadateString(DateTime::parse($this->scheduledOn))
            . Input::verifyRequiredTextInput('permalink', $input, INPUT_LENGTH['blog_permalink_title'], $errors, REGEX_PHP['permalink-title']);

        if (!empty($errors))
            throw new InputException(__CLASS__, $errors);
    }

    public static function update(\Models\DB\BlogPost &$object, BlogPost $source, ?int $userId = null) {
        if ($object->id !== $source->id)
            throw new InvalidArgumentException('Incorrect Blog Post id in update call');
        if ($object->publishedOn && ($object->permalink !== $source->permalink) )
            throw new InvalidArgumentException('Incorrect permalink for published Blog Post');

        $object->title = $source->title;
        $object->description = $source->description;
        $object->contentShort = $source->contentShort;
        $object->contentRest = $source->contentRest;
        $object->mastolink = $source->mastolink;
        $object->isPinned = $source->isPinned;
        $object->isHidden = $source->isHidden;

        if ($userId)
            $object->userId = $userId;
    }
}

?>
