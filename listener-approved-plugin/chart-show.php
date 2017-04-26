<?php
/*
Plugin Name: Radio Milwaukee Listener Approved
Description: Manages submissions for weekly prize drawing and song contest.
Version: 1.0
Author: Flipeleven
Author URI: http://flipeleven.com
*/

/*function chart_show_form(){
	include_once('process.php');
	include_once('form.php');
}*/

// shortcode - this breaks the javascript loader but we don't need it for this site
/*
function chart_show_shortcode( $atts, $content, $shortcode_name ) {
	ob_start();
	chart_show_form();
	return ob_get_flush();
}
add_shortcode( 'chart_show', 'chart_show_shortcode' );
*/

/*function chart_show_scripts() {
    wp_enqueue_script( 'chart-show-js', plugins_url( '/js/scripts.js' , __FILE__ ), array('jquery', 'jquery-ui-core'), '1.0.0' );
}
add_action( 'wp_enqueue_scripts', 'chart_show_scripts' );*/


//Activate plugin
function chart_show_activate() {

  /* Create table schema */
	global $wpdb;
	global $jal_db_version;

	$table_name = $wpdb->prefix . 'chart_show';

	$charset_collate = $wpdb->get_charset_collate();

	$sql = "CREATE TABLE IF NOT EXISTS $table_name (
		id bigint(20) NOT NULL AUTO_INCREMENT,
		vote text NOT NULL,	
		name text NOT NULL,	
		email tinytext NOT NULL,
		phone tinytext NOT NULL,
		address tinytext NOT NULL,
		zip tinytext NOT NULL,
		prize bit(1),
		news bit(1),
		PRIMARY KEY  (id)
	) $charset_collate;";

	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta( $sql );
}

register_activation_hook( __FILE__, 'chart_show_activate' );

//Song view
include_once('table-votes.php');

//User view
include_once('table-users.php');

