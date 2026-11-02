<?php declare(strict_types=1);

namespace App\Components;

use App\Abstract\Component;
use App\Models\App\TabbedContent;

/**
 * @property-read string $activeId
 * @property-read TabbedContent[] $tabs
 */
class TabbedContentComponent extends Component {
    public readonly array $tabs;

    /** @param TabbedContent[] $tabs */
    public function __construct(TabbedContent ...$tabs) {
        $activeFound = false;

        foreach ($tabs as $tab) {
            if ($activeFound)
                $tab->active = false;
            else if ($tab->active)
                $activeFound = true;
        }

        if (!$activeFound)
            $tabs[0]->active = true;

        $this->tabs = $tabs;

        return parent::__construct();
    }
}