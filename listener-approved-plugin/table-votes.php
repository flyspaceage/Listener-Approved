<?php

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class Chart_Show_List extends WP_List_Table {

	/** Class constructor */
	public function __construct() {

		parent::__construct( [
			'singular' => 'Chart Show', //singular name of the listed records
			'plural'   => 'Chart Show', //plural name of the listed records
			'ajax'     => false //does this table support ajax?
		] );

	}

	/**
	 * Retrieve contestants data from the database
	 *
	 * @param int $per_page
	 * @param int $page_number
	 *
	 * @return mixed
	 */
	public static function get_vote_totals( $per_page = 50, $page_number = 1 ) {

		global $wpdb;

		// select all votes
		$sql = "SELECT * FROM {$wpdb->prefix}chart_show";
        $result = $wpdb->get_results( $sql, ARRAY_A );


        // loop through results, save only one vote value per email address to avoid duplicate votes
        $unique_votes = array();
        foreach ($result as $key => $row){
        	// find if email address is already used in the $unique_votes array
        	$email_used = false;
        	foreach ($unique_votes as $vote){
        		if ($vote['email'] == $row['email'] && $vote['email'] != '' && $row['email'] != ''){
        			$email_used = true;
        		}
        	}

        	if (!$email_used && $row['vote'] != ''){
        		$unique_votes[] = $row;
        	}
        }

		// Loop through unique votes, explode values, and save values to new array
        $all_song_ids = array();
        foreach ($unique_votes as $key => $row){
            $song_ids = explode( ',', $row['vote'] );
            $all_song_ids = array_merge( $all_song_ids, $song_ids );
        }

        // count the votes
        $song_count = array_count_values($all_song_ids); 

        $all_songs = array();

        // get titles and save them with their votes
        foreach ($song_count as $key => $value){ 

            $data = array (
			'song_id' => $key,
			'song_name' => get_the_title($key),
			'song_artist' => get_field('artist_name', $key),
			'song_count' => $value
			);

            $all_songs[] = $data;

        }

        // sort results
        if ( ! empty( $_REQUEST['orderby'] ) ) {
            if ($_REQUEST['orderby'] == 'song_count' && $_REQUEST['order'] == 'asc'){
            	usort($all_songs, ['Chart_Show_List', 'order_votes_asc']);
            }else if ($_REQUEST['orderby'] == 'song_count' && $_REQUEST['order'] == 'desc'){
            	usort($all_songs, ['Chart_Show_List', 'order_votes_desc']);
            }
        }else{
        	// default: sort descending
        	usort($all_songs, ['Chart_Show_List', 'order_votes_desc']);
        }

      	return $all_songs;
	}

	protected static function order_votes_asc($a, $b){
		if ((integer) $a['song_count'] == (integer) $b['song_count']){
			return 0;
		}

		return ((integer) $a['song_count'] < (integer) $b['song_count']) ? -1 : 1;
	}

	protected static function order_votes_desc($a, $b){
		if ((integer) $a['song_count'] == (integer) $b['song_count']){
			return 0;
		}

		return ((integer) $a['song_count'] > (integer) $b['song_count']) ? -1 : 1;
	}

	/**
	 * Delete a contestant record.
	 *
	 * @param int $id contestant ID
	 */
	public static function delete_song_votes( $song_id ) {
		global $wpdb;

		$query = "select id, vote from {$wpdb->prefix}chart_show where vote like '%$song_id%'";
		$results = $wpdb->get_results($query, ARRAY_A);

		foreach ($results as $row){
			$removed = str_replace($song_id, '', $row['vote']);
			$cleaned = trim(str_replace(',,', ',', $removed), ',');

			// update vote
			$wpdb->update(
				$wpdb->prefix.'chart_show',
				['vote' => $cleaned],
				['id' => $row['id']],
				['%s'],
				['%d']
				);
		}
	}

	/**
	 * Returns the count of records in the database.
	 *
	 * @return null|string
	 */
	public static function record_count() {
		$items = self::get_vote_totals();
		return count($items);
	}

	/** Text displayed when no contestant data is available */
	public function no_items() {
		echo 'No votes avaliable.';
	}

	/**
	 * Render a column when no column specific method exist.
	 *
	 * @param array $item
	 * @param string $column_name
	 * @return mixed
	 */
	public function column_default( $item, $column_name ) {
		switch ( $column_name ) {
			// case 'song_id':
			case 'song_name':
			case 'song_artist':
			case 'song_count':
				return $item[ $column_name ];
			default:
				return print_r( $item, true ); //Show the whole array for troubleshooting purposes
		}
	}

	/**
	 * Render the bulk edit checkbox
	 *
	 * @param array $item
	 *
	 * @return string
	 */
	function column_cb( $item ) {
		// print_r($item['id']);
		return sprintf(
			'<input type="checkbox" name="bulk-delete[]" value="%s" />', $item['song_id']
		);
	}

	/**
	 * Method for name column
	 * 
	 * @param array $item an array of DB data
	 *
	 * @return string
	 */
	/*function column_name( $item ) {

		$delete_nonce = wp_create_nonce( 'sp_delete_song_votes' );

		$title = '<strong>' . $item['name'] . '</strong>';

		$actions = [
			'delete' => sprintf( '<a href="?page=%s&action=%s&contestant=%s&_wpnonce=%s">Delete</a>', esc_attr( $_REQUEST['page'] ), 'delete', absint( $item['id'] ), $delete_nonce )
		];

		return $title . $this->row_actions( $actions );
	}*/

	/**
	 *  Associative array of columns
	 *
	 * @return array
	 */
	function get_columns() {
		$columns = [
			'cb' => '<input type="checkbox" />',
			// 'song_id'=> 'Song ID',
			'song_name' => 'Name',
			'song_artist' => 'Artist',
			'song_count' => 'Votes'
		];

		return $columns;
	}

	/**
	 * Columns to make sortable.
	 *
	 * @return array
	 */
	public function get_sortable_columns() {
		$sortable_columns = array(
			'song_count' => array( 'song_count', true )
		);

		return $sortable_columns;
	}

	/**
	 * Returns an associative array containing the bulk action
	 *
	 * @return array
	 */
	public function get_bulk_actions() {
		$actions = [
			'bulk-delete' => 'Delete'
		];

		return $actions;
	}

	/**
	 * Handles data query and filter, sorting, and pagination.
	 */
	public function prepare_items() {

		$this->_column_headers = $this->get_column_info();

		/** Process bulk action */
		$this->process_bulk_action();

		$per_page     = $this->get_items_per_page( 'contestants_per_page', 50 );
		$current_page = $this->get_pagenum();
		$total_items  = self::record_count();

		$this->set_pagination_args( [
			'total_items' => $total_items, //WE have to calculate the total number of items
			'per_page'    => $per_page //WE have to determine how many items to show on a page
		] );

		$this->items = self::get_vote_totals( $per_page, $current_page );
	}

	public function process_bulk_action() {

		//Detect when a bulk action is being triggered...
		if ( 'bulk-delete' === $this->current_action() ) {
			$delete_ids = esc_sql( $_POST['bulk-delete'] );

			foreach ($delete_ids as $key => $song_id) {
				self::delete_song_votes( $song_id );
			}

			// wp_redirect( esc_url_raw(add_query_arg()) );
			// exit();

			/*// In our file that handles the request, verify the nonce.
			$nonce = esc_attr( $_REQUEST['_wpnonce'] );

			if ( ! wp_verify_nonce( $nonce, 'sp_delete_song_votes' ) ) {
				die( 'Go get a life script kiddies' );
			}
			else {
				self::delete_song_votes( absint( $_GET['contestant'] ) );
		                // esc_url_raw() is used to prevent converting ampersand in url to "#038;"
		                // add_query_arg() return the current url
		                wp_redirect( esc_url_raw(add_query_arg()) );
				exit;
			}*/
		}

		// If the delete bulk action is triggered
		/*if ( ( isset( $_POST['action'] ) && $_POST['action'] == 'bulk-delete' )
		     || ( isset( $_POST['action2'] ) && $_POST['action2'] == 'bulk-delete' )
		) {

			$delete_ids = esc_sql( $_POST['bulk-delete'] );

			// loop over the array of record IDs and delete them
			foreach ( $delete_ids as $id ) {
				self::delete_song_votes( $id );

			}

			// esc_url_raw() is used to prevent converting ampersand in url to "#038;"
		        // add_query_arg() return the current url
		        wp_redirect( esc_url_raw(add_query_arg()) );
			exit;
		}*/
	}
}

class View_CS_Table {

	// class instance
	static $instance;

	// contestant WP_List_Table object
	public $contestants_obj;

	// class constructor
	public function __construct() {
		add_filter( 'set-screen-option', [ __CLASS__, 'set_screen' ], 10, 3 );
		add_action( 'admin_menu', [ $this, 'plugin_menu' ] );
	}


	public static function set_screen( $status, $option, $value ) {
		return $value;
	}

	public function plugin_menu() {

		$hook = add_submenu_page(
			'edit.php?post_type=chart_show',
			'Listener Approved Voting Results',
			'Voting Results',
			'manage_options',
			'listener_approved_votes',
			[ $this, 'plugin_settings_page' ]
			);

		add_action( "load-$hook", [ $this, 'screen_option' ] );
	}

	/**
	 * Plugin settings page
	 */
	public function plugin_settings_page() {
		?>
		<div class="wrap">
			<h2>Listener Approved Voting Results</h2>
				<div id="poststuff">
					<div id="post-body" class="metabox-holder columns-2">
						<div id="post-body-content">
							<div class="meta-box-sortables ui-sortable">
								<form method="post">
									<?php
									$this->contestants_obj->prepare_items();
									$this->contestants_obj->display(); ?>
								</form>
							</div>
						</div>
					</div>
				<br class="clear">
			</div>
		</div>
	<?php
	}

	/**
	 * Screen options
	 */
	public function screen_option() {

		$option = 'per_page';
		$args   = [
			'label'   => 'Votes',
			'default' => 50,
			'option'  => 'contestants_per_page'
		];

		add_screen_option( $option, $args );

		$this->contestants_obj = new Chart_Show_List();
	}


	/** Singleton instance */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		
		return self::$instance;
	}
}


add_action( 'plugins_loaded', function () {
	View_CS_Table::get_instance();
} );

