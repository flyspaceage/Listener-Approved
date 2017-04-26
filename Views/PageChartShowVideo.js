Class(function PageChartShowVideo() {

	Inherit(this, View);

	var _self = this,
		_elem = _self.element,
        _destroy,
		_overlay,
		_isVisible,
        _videoURL,
		_closeBtn,
        _vidWidth,
        _vidHeight,
        _iframe;

    Global.CHARTSHOWVIDEO = this;

	(function(){
		_init();
		_events();
        _onResize();

	})();

	function _init() {
		_elem.size('100%').css({
            position: 'fixed',
            // pointerEvents:'none',
            display:'none',
            opacity: 0
        }).setZ(30);

        _overlay = _elem.create('.overlay');
        _overlay.size('100%').css({
            opacity: 0.66,
        }).bg(Config.COLORS.dkbrown).setZ(1);

        _iframe = _elem.create('.iframe', 'iframe');
	}

	function _events() {

        _elem.interact({
            onClick: _animateOut,
            display:'block'
            // pointerEvents:'auto'
        });

        _overlay.interact({
            onClick: _animateOut
        });

        //Resize event
        Evt.subscribe(window, Evt.RESIZE, _onResize);
    }
    
    function _createEmbed(){

        _iframe.div.src = _videoURL;
        _iframe.css({
            opacity: 1,
            display:'block',
            left: 0,
            right: 0,
            margin: '0 auto',
            top:'50%',
            transform:'translate(0, -50%)'
        }).setZ(10);
    }

    function _animateIn(){
    	_isVisible = true;
    	_elem.tween({opacity: 1}, 0.33, Config.EASING.inout);
        _elem.css({display:'block'});
        _onResize();


    }

    function _animateOut(){
    	_isVisible = false;
		_elem.tween({opacity: 0}, 0.33, Config.EASING.inout);
        _elem.css({display:'none'});
        _self.delayedCall(function(){
            _iframe.div.src = '';
        }, 333); 
    }

    this.open = function(videoURL){ 
        _videoURL = videoURL;       
        _createEmbed();  
        _animateIn();
    };

    function _onResize() {

        ratio = (9/16);

        var _vidWidth = (Stage.width * ratio);
        var _vidHeight = (_vidWidth * ratio);

        _iframe.size( _vidWidth, _vidHeight );
 
    }        
});