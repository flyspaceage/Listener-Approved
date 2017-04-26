
Class(function PageChartShowError(){

    Inherit(this, View);
    
    var _self = this,
        _elem = _self.element,
        _msgTxt,
        _msgBg,
        _closeBtn,
        _overlay;
        
    Global.CHARTSHOWERROR = this;
    
    (function(){
        _init();
        _events();
        _onResize();
    })();
    
    function _init(){
        
        _elem.size('100%').css({
            position: 'fixed',
            display: 'none',
            opacity: 0
        }).setZ(60);

        _overlay = _elem.create('.overlay');
        _overlay.size('100%').css({
            opacity: 0.66
        }).bg(Config.COLORS.dkbrown).setZ(-20);

        _msgBg = _elem.create('.msgBg');
        _msgTxt = _msgBg.create('.msgTxt');
        _msgTxt.text('Please select ONLY 5 songs');
        _closeBtn = _msgBg.create('.closeBtn');
        _closeBtn.css({
            fontFamily:'"Nunito", sans-serif',
            color:'#f0ede9',
            width:'1em',
            height: '1em',
            fontSize: '2em',
            lineHeight: '1em',
            textAlign: 'center'
        }).text('<strong style="position: static;">x</strong>').setZ(40);
    }
    
    // function _createMsg(errormsg){
    //     _msgTxt.text(errormsg);
    // }

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
            _msgBg.css({display: 'none'});
        }, 333); 
    }

    this.open = function(errormsg){ 
        // _createMsg(errormsg);  
        _animateIn();
    };
    
    function _events(){
        _closeBtn.interact({
        	onClick: _animateOut
        });

        _overlay.interact({
            onClick: _animateOut
        });

        //Resize
        Evt.subscribe(window, Evt.RESIZE, _onResize);
    }

    
    function _onResize(){
        _msgBg.css({
            background:'#f0ede9',
            borderRadius:'10px',
            opacity: 1,
            display:'block',
            left: 0,
            right: 0,
            margin: '0 auto',
            top:'37%',
            transform:'translate(0, -50%)',
        }).setZ(10);
        
        _msgTxt.css({
            left:'0',
            right:'0',
            top:'50%',
            transform:'translate(0, -50%)',
            position:'absolute',
            color: Config.COLORS.dkbrown,
            fontFamily: 'Gotham SSm A, Gotham SSm B',
            textAlign: 'center',
            fontSize: '1em',
            padding: '1em'
        });

        _closeBtn.transform({
            // x: Stage.width / 2,
            // y: -40
            right: 0,
            top: -40
        });

        _msgBg.css({
            height: Stage.height / 8,
            width: Device.mobile.phone ? Stage.width * 0.8 : Stage.width / 2
        });
    }

//end of page!
});