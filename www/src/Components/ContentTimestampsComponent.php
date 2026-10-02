<?php declare(strict_types=1);

namespace App\Components;

use DateTime;
use App\Abstract\Component;
use App\Utils\DateTime as DateTimeUtil;

class ContentTimestampsComponent extends Component {
    public readonly string $createdOn;
    public readonly string $modifiedOn;
    public readonly string $showRelativeDate;

    public function __construct(DateTime $createdOn, ?DateTime $modifiedOn = null, bool $showRelativeDate = false) {
        $this->createdOn = DateTimeUtil::toString($createdOn);
        $this->modifiedOn = DateTimeUtil::toString($modifiedOn);
        $this->showRelativeDate = $showRelativeDate ? 'true' : 'false';
        
        return parent::__construct();
    }
}