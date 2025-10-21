<?php declare(strict_types=1);

require_once 'services/configuration.service.php';

use Services\ConfigurationService;

$input = json_decode(file_get_contents('php://input'), true);
$errors = [];

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'POST':
        return [ 'success' => true, 'value' => $input ];

    case 'PATCH':
        return [ 'success' => true, 'value' => $input];

    default:
        return [ 'success' => false, 'errors' => [ TEXT_INVALID_REQUEST ] ];
}

?>