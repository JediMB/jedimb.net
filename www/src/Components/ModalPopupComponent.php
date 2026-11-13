<?php declare(strict_types=1);

namespace App\Components;

use App\Abstract\Component;

class ModalPopupComponent extends Component {
    public static string $baseClass = 'modal-popup';

    public function __construct() {
        return parent::__construct();
    }
}
