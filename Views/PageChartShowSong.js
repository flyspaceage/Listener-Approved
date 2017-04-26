Class(function PageChartShowSong(_data, index) {

    Inherit(this, View);

    var _self = this,
        _elem = _self.element,
        _content,
        _body,
        _checkbox,
        _textContent,
        _title,
        _artist,
        _thumb,
        _innerBox,
        _checkbox,
        _checkMark,
        _playButton,
        _songCheck = false,
        _check = false;

    (function(){
        _init();
        _setSize();
        _events();
    })();

    function _init(){

        _content = _elem.create('.content');
        _textContent = _content.create('textcontent');
        _checkbox = _content.create('.checkbox');
        _songCheck = _elem.create('.songCheck', 'input');
        _songCheck.div.value = _data.ID;
        _songCheck.div.type = 'checkbox';
        _songCheck.css({visibility:'hidden'});
        _innerBox = _checkbox.create('.innerBox');
        _checkMark = _innerBox.create('.checkMark').text("&#xf00d;");
        _checkMark.css({visibility: 'hidden'});
        _title = _textContent.create('.title');
        _title.text('<strong>"'+_data.post_title+'"</strong>');
        _artist = _textContent.create('.artist');
        _artist.text(_data.artist);
        _thumb = _content.create('.thumb');
        _thumb.css({backgroundImage: 'url(https://img.youtube.com/vi/'+_data.youtube_embed_url+'/default.jpg)'});
        _playButton = _thumb.create('.playButton');
        _playButton.text("&#xf04b;");
    }

    //Property that is the post ID value
    this.postID = _data.ID;

    function checkForSong(){
        return _songCheck.div.checked;
    }

    this.checkForSong = function(){
        return checkForSong();
    };

    //Hover functions for checkboxes
    function checkBoxOver(){
        if (_check === false){

            _content.tween({
                border:'2px solid #f9971c'
            }, 0.25, Config.EASING.inout);
        }
    }

    function checkBoxOut(){
        if (_check === false){

          _content.tween({
                border:'2px solid #00aaa7'
          }, 0.25, Config.EASING.inout);
        }
    }

    function _showErrorMsg(){
        Global.CHARTSHOWERROR.open();
    }

    function onClickCheckBox(event){
        // console.log(event);
        // console.log(song_increment)
        // console.log(Global.PAGE_CHARTSHOWFORM)
        console.log(Global.PAGE_CHARTSHOWFORM.song_increment);
        
        if (Global.PAGE_CHARTSHOWFORM.song_increment < 5) {

            if (_check === false) {

                Global.PAGE_CHARTSHOWFORM.song_increment++;
                _check = true;
                _checkMark.css({
                    visibility:'visible'
                });
                _songCheck.div.checked = true;

            } else {

                Global.PAGE_CHARTSHOWFORM.song_increment--;

                _check = false;
                _checkMark.css({
                    visibility:'hidden'
                });
                _songCheck.div.checked = false;
            }
        } else {

            if (_check) {
                Global.PAGE_CHARTSHOWFORM.song_increment--;

                _check = false;
                _checkMark.css({
                    visibility:'hidden'
                });
                _songCheck.div.checked = false;
            } else {
                _showErrorMsg();
            }
            
        }

    
    console.log(Global.PAGE_CHARTSHOWFORM.song_increment);
    // console.log(_check);

    }

    function playAudioOnClick(){
        Global.CHARTSHOWVIDEO.open('https://youtube.com/embed/'+_data.youtube_embed_url+'?autoplay=1');
    }


    function _events(){

        if (!Device.mobile) {
            _elem.interact({
                onOver: checkBoxOver,
                onOut: checkBoxOut,
                onClick: onClickCheckBox
            });
        }

        _title.interact({
            onOver: checkBoxOver,
            onOut: checkBoxOut,
            onClick: onClickCheckBox
        });

        _checkbox.interact({
            onOver: checkBoxOver,
            onOut: checkBoxOut,
            onClick: onClickCheckBox
        });

        _thumb.interact({
            onOver: checkBoxOver,
            onOut: checkBoxOut,
            onClick: playAudioOnClick
        });

        _playButton.interact({
            onOver: checkBoxOver,
            onOut: checkBoxOut,
            onClick: playAudioOnClick
        });

        Evt.subscribe(window, Evt.RESIZE, _setSize);      
    }
        

    function _setSize(){
    
        _elem.css({
            // width: Device.mobile.phone ? Stage.width - Stage.width/10 : Stage.width/2.6,
            width: Device.mobile.phone ? '98%' : '48.5%',
            height:'8em',
            position:'relative',
            marginBottom:'1%',
            // marginRight: '1%',
            marginLeft: '1%',
            cssFloat: 'left'
        });

        _content.css({
            position:'relative',
            float:'left',
            background:'#f0ede9',
            border: '2px solid #00aaa7',
            borderRadius:'10px',
            width:'100%',
            height:'8em',
        });

        _textContent.transform({
            x: Device.mobile.phone ? Stage.width/4.8 : Stage.width/11,
            y: 16
        }).css({
            position:'absolute',
            width: Device.mobile.phone ? Stage.width/2.6 : Stage.width/6.4,
            height: 'auto',
            lineHeight: '1em',
            fontFamily: 'Gotham SSm A, Gotham SSm B',
            fontSize:'1em',
            color: '#404242',
            textAlign:'left',
        });

        _checkbox.css({
            position:'absolute',
            borderRight: '1px solid #707069',
            height:'100%',
            width:'20%',
            left:'0px',
            top:'0'
        });

        _innerBox.size('40%', '40%').css({
            margin:'0 auto',
            border: '1px solid #b0afac',
            background:'#fefefd',
            borderRadius:'5px',
            left:'0',
            right:'0',
            top:'50%',
            transform:'translate(0, -50%)',
            position:'absolute',
        });
        // For iPhone SE
        if (Mobile.phone && Stage.width <= 320) {

            _innerBox.css({
                width: '42%',
                height: '32%'
            });
        }

        _checkMark.css({
            left:'0',
            right:'0',
            top:'45%',
            transform:'translate(0, -50%)',
            position:'absolute',
            fontFamily: "FontAwesome",
            color: '#f9971c',
            // visibility:'hidden',
            fontSize: Device.mobile.phone ? Stage.width/110+'em' : '3.5em'
        }).setZ(9999);
        
        // For iPhone SE
        if (Mobile.phone && Stage.width <= 320) {
            _checkMark.css({
                left: -1.4
                // top: 1.8
            });
        }

        _title.css({
            position:'static',
            width: '100%',
            height: 'auto',
            fontFamily: 'Gotham SSm A, Gotham SSm B',
            fontSize:'1em',
            color: '#404242',
            textAlign:'left',
            lineHeight: Device.mobile.phone ? '1em' : '1.4em'
        });

        _artist.transform({
            y: 10
        }).css({
            position:'static',
            width:'100%',
            fontFamily: 'Gotham SSm A, Gotham SSm B',
            // width: Stage.width/2.2,
            height: 'auto',
            fontSize:'1em',
            lineHeight:'1em',
            color: '#404242',
            textAlign:'left'
        });

        _thumb.css({
            position: 'relative',
            cssFloat: 'right',
            backgroundImage: 'url(https://img.youtube.com/vi/'+_data.youtube_embed_url+'/default.jpg)',
            backgroundRepeat:'no-repeat',
            backgroundSize: 'cover',
            height:'100%',
            width: Device.mobile.phone ? Stage.width/3.2 : Stage.width/8,
            borderRadius: '0px 8px 8px 0px'
        }).setZ(10);

        _playButton.css({
            left:0,
            right:0,
            top: Device.mobile.phone ? 30 : 40,
            height: '100%',
            margin:'0 auto',
            position:'absolute',
            fontFamily: "FontAwesome",
            fontSize:'4em',
            textAlign:'center',
            color: '#ffffff'
        }).text("&#xf04b;");
      
    }
//end of page...
});