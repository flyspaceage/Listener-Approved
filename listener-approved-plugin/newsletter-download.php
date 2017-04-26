<?php
include_once('../../../wp-config.php');
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="newsletter-download.csv"');

$query = "SELECT * FROM {$wpdb->prefix}chart_show WHERE news > 0";
$newslettList = $wpdb->get_results( $query, ARRAY_A );
$headers = "Name".','."Email".','."Phone".','."Address".','."Zip";

echo($headers);
echo "\n";
	foreach ( $newslettList as $newsl ) {
		$name = trim(($newsl['name']),' ');
		$email = trim(($newsl['email']),' ');
		$phone = trim(($newsl['phone']),' ');
		$address = trim(($newsl['address']),' ');
		$zip = trim(($newsl['zip']),' ');
		$doc_info = '"'.$name.'",'.$email.','.$phone.',"'.$address.'",'.$zip;
		echo($doc_info);
		echo "\n";

	}

?>