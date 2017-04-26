<?php
require_once('../../../wp-config.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
	// process form data	
	$post = array(
		'songCheck' => '',
		'name' => '',
		'email' => '',
		'phone' => '',
		'address' => '',
		'prizeCheck' => '',
		'newsCheck' => ''
		);

	$post = array_merge($post, $_POST);

	$required_fields = get_field('required_fields', $post['post_id']);

	if (! is_array($required_fields)){
		$required_fields = array();
	}	

	$had_errors = false;
	$result = '88Nine Radio MKE thanks you for participating!';

	if (in_array("name", $required_fields)) {
		if ($_POST['name']==''){
			$had_errors = true;
			$result = 'Please fill in the NAME field.';
		}else if(is_numeric($_POST['name'])){
	    	$result = 'Please enter your NAME.';
		}
	}

	if (in_array("email", $required_fields)){
		if ($_POST['email']==''){
			$had_errors = true;
			$result = 'Please fill in the EMAIL field.';
		}else{
			//required but not empty
		}
	}

	/*else if(filter_var("some@address.com", FILTER_VALIDATE_EMAIL)){
			$result = 'Please enter a valid EMAIL address.';	    
	    }*/

	if (in_array("phone", $required_fields)){
		if ($_POST['phone']==''){
			$had_errors = true;
			$result = 'Please fill in the PHONE field.';
		}elseif(!is_numeric($_POST['phone'])){
	    	$result = 'Please enter a valid phone number.';
		}
	}

	if (in_array("address", $required_fields)){
		if ($_POST['address']==''){
			$had_errors = true;
			$result = 'Please fill in the ADDRESS field.';
		}else{
			//required but not empty
		}
	}

	if (in_array("zip", $required_fields)){
		if ($_POST['zip']==''){
			$had_errors = true;
			$result = 'Please fill in the ZIP CODE field.';
		}elseif(!is_numeric($_POST['zip'])){
	    	$result = 'Please enter a valid zip code.';
	    }
	}

	// //Create error log array
	// $field_errors = array();

	// //Define required fields 
	// $required_fields = array(
	// 	'name',
	// 	'email',
	// 	'phone',
	// 	'address'
	// 	);

	//Check for empty required values
	// foreach ($required_fields as $value) {
	// 	if (empty($post[$value])){
	// 		$field_errors[] = $value;
	// 	}
	// }
	
//Set value of PRIZE for each contestant
	$prize = $_POST['prizeCheck'] == 'true' ? 1 : 0;

	// if ($_POST['prizeCheck'] == 'true'){
	//   $prize = 1;//YES
	//  } else {
	//   $prize = 0;//NO
	// }

//Set value of NEWS for each
	$news= $_POST['newsCheck'] == 'true' ? 1 : 0;

	// if ($_POST['newsCheck'] == 'true'){
	//   $news = 1;//YES
	//  } else {
	//   $news = 0;//NO
	// }

	if ($had_errors === false){
		//Record data
		global $wpdb;

			$vote = $post['songCheck'];
			$name = $post['name'];
			$email = $post['email'];
			$phone = $post['phone'];
			$address = $post['address'];
			$zip = $post['zip'];
			$prize = $post['prizeCheck'];
			$news = $post['newsCheck'];

			$table_name = $wpdb->prefix . 'chart_show';

			$wpdb->insert( 
				$table_name, 
				array( 
					'vote' => $vote, 
					'name' => $name,
					'email' => $email,  
					'phone' => $phone,
					'address' => $address,
					'zip' => $zip, 
					'prize' => $prize,
					'news' => $news
				),
				array( 
				'%s', 
				'%s', 
				'%s', 
				'%s',
				'%s',
				'%s',
				'%d', 
				'%d' 
			) 
		);
	}
// }
echo json_encode($result);
//End page...	
}