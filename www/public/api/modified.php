<?php declare(strict_types=1);

use Services\TableModifiedService;
use Utils\Response;

$supportedTables = [
    'blog_post', 'configuration', 'gallery', 'gallery_image', 'image', 'page', 'social_link'
];

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'GET':
        try {
            $table = $GLOBALS['api_params'][0];

            if (!in_array($table, $supportedTables))
                return Response::BadRequest('Unsupported table name.');

            $service = TableModifiedService::getInstance(); /** @var TableModifiedService $service */
            $date = $service->getOrCreateModifiedDate($table);

            return Response::Success($date);
        }
        catch (Exception $e) {
            return Response::Error([$e->getMessage()]);
        }

    default:
        return Response::InvalidRequest();
}

?>