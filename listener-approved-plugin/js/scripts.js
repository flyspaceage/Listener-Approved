(function($){

//Show youtube player
$(document).ready(function(){
    $("#show").click(function(){
        $("#show").hide();
    });
    $("#show").click(function(){
        $("#hide").show();
    });
});

//Hide youtube player on Pause
$(document).ready(function(){
    $("#hide").click(function(){
        $("#hide").hide();
    });
    $("#hide").click(function(){
        $("#show").show();
    });
});

//Toggle youtube between play and pause views
$(document).ready(function(){
    $(".control").click(function(){
        $(".url").toggle();
    });
});

$(document).ready(function(){
	$( ".playerFrame" ).css({
		"backgrounColor": "red",
		"display": "inline",
		"textDescoration": "none"
	});
});

//Change color when active
$("#hide").on("mousedown", function() {
    $(this).toggleClass('back-red');
})
.on("mouseup", function(e) {
    $(this).toggleClass('back-red');
});


//End jQuery
})(jQuery);

