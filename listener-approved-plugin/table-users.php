<?php

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class Listener_Approved_List extends WP_List_Table {

	/** Class constructor */
	public function __construct() {

		parent::__construct( [
			'singular' => __( 'Listener Approved', 'sp' ), //singular name of the listed records
			'plural'   => __( 'Listener Approved', 'sp' ), //plural name of the listed records
			'ajax'     => false //does this table support ajax?
		] );

	}

	/**
	 * Retrieve listeners data from the database
	 *
	 * @param int $per_page
	 * @param int $page_number
	 *
	 * @return mixed
	 */
	public static function get_listeners( $per_page = 50, $page_number = 1 ) {

		global $wpdb;

		$sql = "SELECT * FROM {$wpdb->prefix}chart_show WHERE id > 0";

        if ( ! empty( $_REQUEST['orderby'] ) ) {
            $sql .= ' ORDER BY ' . esc_sql( $_REQUEST['orderby'] );
            $sql .= ! empty( $_REQUEST['order'] ) ? ' ' . esc_sql( $_REQUEST['order'] ) : ' ASC';
        }

        $sql .= " LIMIT $per_page";
        $sql .= ' OFFSET ' . ( $page_number - 1 ) * $per_page;

        $result = $wpdb->get_results( $sql, ARRAY_A );

        return $result;
}

	/**
	 * Delete a contestant record.
	 *
	 * @param int $id contestant ID
	 */
	public static function delete_contestant( $id ) {
		global $wpdb;

		$wpdb->delete(
			"{$wpdb->prefix}chart_show",
			[ 'id' => $id ],
			[ '%d' ]
		);
	}

	/**
	 * Returns the count of records in the database.
	 *
	 * @return null|string
	 */
	public static function record_count() {
		global $wpdb;

		$sql = "SELECT COUNT(*) FROM {$wpdb->prefix}chart_show";

		return $wpdb->get_var( $sql );
	}

	/** Text displayed when no contestant data is available */
	public function no_items() {
		_e( 'No listeners avaliable.', 'sp' );
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
			case 'id':
			case 'name':
			case 'email':
			case 'phone':
			case 'address':
			case 'zip':
			case 'prize':
			case 'news':
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
		return sprintf(
			'<input type="checkbox" name="bulk-delete[]" value="%s" />', $item['id']
		);
	}

	/**
	 * Method for name column
	 * 
	 * @param array $item an array of DB data
	 *
	 * @return string
	 */
	function column_name( $item ) {

		$delete_nonce = wp_create_nonce( 'sp_delete_contestant' );

		$title = '<strong>' . $item['name'] . '</strong>';

		$actions = [
			'delete' => sprintf( esc_attr( $_REQUEST['page'] ), 'delete', absint( $item['id'] ), $delete_nonce )
		];

		return $title . $this->row_actions( $actions );
	}

	/**
	 *  Associative array of columns
	 *
	 * @return array
	 */
	function get_columns() {
		$columns = [
			'cb' => '<input type="checkbox" />',
			'id'=> __( 'ID', 'sp' ),
			'name' => __( 'Name', 'sp' ),
			'email' => __( 'Email', 'sp' ),
			'phone' => __( 'Phone', 'sp' ),
			'address' => __( 'Address', 'sp' ),
			'zip' => __( 'Zip Code', 'sp' ),
			'prize' => __( 'Contest', 'sp' ),
			'news' => __( 'Newsletter', 'sp' )
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
			'id' => array( 'id', true ),
			'name' => array( 'name', true ),
			'prize' => array( 'prize', true ),
			'news' => array( 'news', true ),

		);

		return $sortable_columns;
	}


	/**
	*Get associative array for newsletter of contestant
	*
	*@return array
	*/
	public function get_listener_newsletter(){
		global $wpdb;
		//select all listeners
		$query = "SELECT * FROM {$wpdb->prefix}chart_show WHERE news > 0";
		$newslettList = $wpdb->get_results( $query, ARRAY_A );
		//print_r( $newslettList );
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

		$newsltr      = $this->get_listener_newsletter();
		$per_page     = $this->get_items_per_page( 'listeners_per_page', 50 );
		$current_page = $this->get_pagenum();
		$total_items  = self::record_count();

		$this->set_pagination_args( [
			'total_items' => $total_items, //WE have to calculate the total number of items
			'per_page'    => $per_page //WE have to determine how many items to show on a page
		] );

		$this->items = self::get_listeners( $per_page, $current_page );
	}

	public function process_bulk_action() {

		//Detect when a bulk action is being triggered...
		if ( 'delete' === $this->current_action() ) {

			// In our file that handles the request, verify the nonce.
			$nonce = esc_attr( $_REQUEST['_wpnonce'] );

			if ( ! wp_verify_nonce( $nonce, 'sp_delete_contestant' ) ) {
				die( 'Go get a life script kiddies' );
			}
			else {
				self::delete_contestant( absint( $_GET['contestant'] ) );
		                // esc_url_raw() is used to prevent converting ampersand in url to "#038;"
		                // add_query_arg() return the current url
		                wp_redirect( esc_url_raw(add_query_arg()) );
				exit;
			}
		}

		// If the delete bulk action is triggered
		if ( ( isset( $_POST['action'] ) && $_POST['action'] == 'bulk-delete' )
		     || ( isset( $_POST['action2'] ) && $_POST['action2'] == 'bulk-delete' )
		) {

			$delete_ids = esc_sql( $_POST['bulk-delete'] );

			// loop over the array of record IDs and delete them
			foreach ( $delete_ids as $id ) {
				self::delete_contestant( $id );

			}

			// esc_url_raw() is used to prevent converting ampersand in url to "#038;"
		        // add_query_arg() return the current url
		        wp_redirect( esc_url_raw(add_query_arg()) );
			exit;
		}
	}
}

class View_LA_Table {

	// class instance
	static $instance;

	// contestant WP_List_Table object
	public $listeners_obj;

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
			'Listener Approved Users',
			'Users',
			'manage_options',
			'listener_approved_users',
			[ $this, 'plugin_settings_page' ]
			);


		add_action( "load-$hook", [ $this, 'screen_option' ] );
	}
	

	/**
	 * Plugin settings page
	 */
	public function plugin_settings_page() {
		?>
		<style>
		.wrap #poststuff #post-body #newsletter a {
			float: right;
		}
		</style>
		
	
		<div class="wrap">
			<h2>Listener Approved Users</h2>
					<div id="poststuff">
						<div id="post-body" class="metabox-holder columns-2">
							<div id ="newsletter"><a href="/wp-content/plugins/chart-show/newsletter-download.php" class="button button-primary button-large">Download Newsletter Signups (CSV)</a>

							<div id="post-body-content">
								<div class="meta-box-sortables ui-sortable">
									<form method="post">
									<?php
									$this->listeners_obj->prepare_items();
									$this->listeners_obj->display(); ?>
								</form>
							</div>
						</div>
					</div>
				<br class="clear">
			</div>
		</div>
			<script type="text/javascript" language="javascript">		
				document.getElementById('newstitle').addEventListener("mouseover", function(){
					this.style.color='#0A76D2';
			});
				document.getElementById('newstitle').addEventListener("mouseout", function(){
					this.style.color='#595656';
			});
			</script>
	<?php
	}

	/**
	 * Screen options
	 */
	public function screen_option() {

		$option = 'per_page';
		$args   = [
			'label'   => 'listeners',
			'default' => 50,
			'option'  => 'listeners_per_page'
		];

		add_screen_option( $option, $args );

		$this->listeners_obj = new Listener_Approved_List();
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
	View_LA_Table::get_instance();
} );

