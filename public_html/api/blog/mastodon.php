<?php declare(strict_types=1);

$input = json_decode(file_get_contents('php://input'), true);

$curl = curl_init();

switch( $_SERVER['REQUEST_METHOD'] ) {
    case 'POST':
        $params = $GLOBALS['api_params'];
        
        $headers = [
            'Authorization: Bearer ' . MASTODON_TOKEN,
            'Content-Type: application/json; charset=UTF-8'
        ];
        // 'Idempotency-Key: [key]' --post-associated key that prevents duplicate toots

        $data = json_encode(array(
            'status' => 'Testing123',
            'language' => 'eng',
            'visibility' => 'public'
        ));

        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_URL, 'https://' . MASTODON_HOST . '/api/v1/statuses');
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLINFO_HEADER_OUT, true);
        
        $result = curl_exec($curl);

        echo $result;
        break;

    default:
        echo json_encode(['error' => 'Invalid request method']);
}

curl_close($curl);

?>