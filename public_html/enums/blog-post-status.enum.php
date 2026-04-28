<?php declare(strict_types=1);

namespace Enums;

enum BlogPostStatus : string {
    case Hidden = 'hidden';
    case Visible = 'visible';
    case Published = 'published';
    case Unpublished = 'unpublished';
}

?>