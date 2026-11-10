<?php declare(strict_types=1);

namespace App\Components;

use App\Abstract\Component;

class ContentEditorComponent extends Component {
    public readonly string $formId;
    public readonly string $value;

    public static string $baseClass = 'content-editor';

    public function __construct(string $formId, ?string ...$value) {
        $this->formId = $formId;
        $this->value = implode('', $value);

        return parent::__construct();
    }
}
