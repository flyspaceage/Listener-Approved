<?php

ob_start();
require_once('wp-config.php');

$args = array(
    'numberposts'=> 20,
    'post_type'=>'chart_show'
    // 'post_status'=>'publish'
    );                 
$songs = get_posts( $args );
// echo '<pre>';
foreach ( $songs as $key => $value){
    $value = (array)$value;

    $url = get_field('youtube_url', $value['ID']);
    $value['youtube_embed_url'] = $url;

    $title = get_field('song_title', $value['ID']);
    $value['title'] = $title;


    $artist = get_field('artist_name', $value['ID']);
    $value['artist'] = $artist;


    $songs[$key] = $value;
}
// var_dump($songs);
// echo '</pre>';
if ($songs == '') {
    echo json_encode('');
    exit();
}

ob_end_clean();

echo json_encode($songs);

exit();
