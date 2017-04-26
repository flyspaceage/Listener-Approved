<?php
// basic error message when field was empty
function output_error($field, $field_errors){
	if (is_array($field_errors)){
		if (in_array($field, $field_errors)){
			if ($field == 'event_image'){
				echo '<div id="'.$field.'_error" class="field-error">You need to upload an image.</div>';
			}else{
				echo '<div id="'.$field.'_error" class="field-error">This field can\'t be left blank.</div>';
			}
		}
	}
}

$show_form = true;
?>

<div class="chart-show">
	<form id="chart-show" enctype="multipart/form-data" method="post" name="charts" action="" class="chart-show-form">
		<div class="all-fields-wrap">
										<!-- 			Ballot Box 				 -->
		<h1>Chart Show Ballot</h1>
		<h6><div class="required-items">Fields marked with an <span class="req-symbol">*</span> are required</div></h6>

	<hr /> 
			<h4>Contact Information</h4>

			<div class="field-wrap text-wrap label-above">
				<label for="first_name" id="first_name_label">Name<span class='req-symbol'><strong>*</strong></span></label>

				<input id="first_name" name="first_name" type="text" placeholder="" value="<?php echo $_POST['first_name']; ?>" />
				
				<?php output_error('first_name', $field_errors); ?>
			</div>

			<div class="field-wrap text-wrap label-above">
				<label for="email" id="email_label">Email Address<span class='req-symbol'><strong>*</strong></span></label>

				<input id="email" name="email" type="text" placeholder="" value="<?php echo $_POST['email']; ?>" />

 				<?php output_error('email', $field_errors); ?>
			</div>

			<div class="field-wrap text-wrap label-above">
				<label for="phone" id="phone_label">Phone Number<span class='req-symbol'><strong>*</strong></span></label>

				<input id="phone" name="phone" type="text" placeholder="" value="<?php echo $_POST['phone']; ?>" />
				
				<?php output_error('phone', $field_errors); ?>
			</div>	
	<hr /> 

			<h2>Chart Show Ballot</h2>

			<p>Select the checkbox next to your top 5 songs!<span class='req-symbol'><strong>*</strong></span></p>

		<!-- Used Custom Post Type to create an Array, Loop through the Array and assigned each Object a Checkbox --> 
		<pre>
		<ul class="playerFrame">
		<?php 
		//ERROR MESSAGE
		    if(isset($msg)){  // Check if $msg is not empty
		        echo '<div class="statusmsg">'.$msg.'</div><br>'; // Display our message class "statusmsg".
		    } 
			//Use get_posts function to create an array from data entered into Chart Show
			$args = array(
				'numberposts'=> -1,
				'post_type'=>'chart_show',
				'post_status'=>'publish'
				);
				 
				$song = get_posts( $args );
			 
			 //Loop through and create Checkbox 
			 foreach ($song as $key => $s){
			 	echo '<li><div class="player"><input id="song" name="song['.$s->ID.']" type="checkbox" />'.$s->post_title.'</div></li>';

			 	echo '<li><div class="control"><i id="show" class="fa fa-play" aria-hidden="true"></i><i id="hide" style="display:none" class="fa fa-pause" aria-hidden="true"></i></div></li>';//Play

			 	// echo '<i id="hide" style="display:none" class="fa fa-pause" aria-hidden="true"></i>';//Pause

				echo '<li><div class="url" style="display:none"><iframe width="560" height="315" src="//www.youtube.com/embed/' .$s->youtube_url.' " frameborder="0" allowfullscreen></iframe></div></li><br>';
			 }
			 
						 //'.$s->youtube_url.'
		?>
		</ul>
		</pre>
		
		<div class="writein"><p>Didn't see your pick on the list? Write in an artist and song title here:</p>
				<textarea></textarea>
		</div>

	<hr />

		<div class="field-wrap text-wrap label-above">
			<div class="prize"><h4>Contest</h4></label>
				<p>Enter my name into Radio Milwaukee's contest!</p>
				<label for="prize" id="prize_label">Yes<input id="prize" name="prize" type="checkbox" placeholder="" value="<?php echo $_POST['prize']; ?>" />No<input id="prize" name="prize" type="checkbox" placeholder="" value="<?php echo $_POST['prize']; ?>" /></label>
			</div>

		<div class="field-wrap submit-wrap label-above">
			<div id="submit">
				<input type="submit" value="Submit" />
			</div>

			<div id="processing" style="display: none;">
				<input type="submit" value="Processing" disabled />
			</div>
		</div>
				
		</div>
	</form>

</div>
