Class(function PageChartShowForm(data) {

    Inherit(this, View);
  
    var _self = this,
        _data = data,
        _elem = _self.element,
        _content,
        _about,
        _div,
        _pDiv,
        _nDiv,
        _form,
        _name,
        _email,
        _phone,
        _address,
        _zip,
        _chartShowItems,
        _songCheck,
        _submitButton,
        _submitOver,
        _submitOut,
        _subTitle,
        _playList,
        _prize,
        _prizeBoxYes,
        _prizeBoxNo,
        _newsletter,
        _newsBoxYes,
        _newsBoxNo,
        _newsYesText,
        _newsNoText,
        _prizeYesText,
        _prizeNoText,
        _submit,
        _submitComplete,
        _allSongItems = [],
        _prizeCheck = false,
        _newsCheck = false,
        _checkYes,
        _checkNo,
        _thankYouMsg,
        _sorryMsg;

        _self.song_increment = 0;

        Global.PAGE_CHARTSHOWFORM = _self;


    (function() {
        _init();
        _events();
        _onResize();
    })();

    function _init(){
        _elem.div.className += ' clear';

        _content = _elem.create('.content');
        _self.content = _content;
       
        _content.css({
          overflow:'auto',
          height:'100%',
          background:'#00aaa7'
        });

        //Title and About section
        _subTitle = _content.create('.subTitle', 'h1');
        _subTitle.css({
            fontFamily: 'Gotham SSm A, Gotham SSm B',
            color: '#404242',
            textAlign: 'center',
            fontSize:'2em'
        }).text('Listener Approved Ballot');

        _about = _content.create('.about', 'p');
        _about.css({
            fontFamily: 'Gotham SSm A, Gotham SSm B',
            color: '#ffffff',
            textAlign: 'center'
        }).text('<strong><h3>Contact Information</h3></strong><br><em>Fields marked with <span style="color: #f8981c;"> * </span> required to vote and enter the contest.<br>Your information will be used for internal purposes and will not be sold.</em>');

        //Contact information form
        _form = _content.create('.content', 'form');
        _form.css({
          width: '100%',
          margin:'0 auto',
          display: 'inline-block',
          fontFamily: 'Gotham SSm A, Gotham SSm B',
          boxSizing: 'border-box',
          fontSize:'1.5em'
        });

        _name = _form.create('.name', 'input');
        _name.css({
            borderRadius:'8px',
            width: '30%',
            padding: '1.5%',
            marginLeft:'2.5%'
        }).text('Name');

        if(typeof _data.acf.required_fields !== 'undefined'){

            if (_data.acf.required_fields.indexOf('name') > -1){
                  _name.div.placeholder = 'Name *';
            }else{
                  _name.div.placeholder = 'Name';
            }

            _email = _form.create('.email', 'input');
            _email.css({
                borderRadius:'8px',
                width: '30%',
                padding: '1.5%',
                marginLeft:'2.5%'
            }).text('Email');

            if (_data.acf.required_fields.indexOf('email') > -1){
                  _email.div.placeholder = 'Email *';
            } else{
                  _email.div.placeholder = 'Email';
            }

            _phone = _form.create('.phone', 'input');
            _phone.css({
                borderRadius:'8px',
                width: '30%',
                padding: '1.5%',
                marginLeft:'2.5%'
            }).text('Phone');

            if (_data.acf.required_fields.indexOf('phone') > -1){
                _phone.div.placeholder = 'Phone *';
            } else {
                _phone.div.placeholder = 'Phone';
            }

            _address = _form.create('.address', 'input');
            _address.css({
                borderRadius:'8px',
                width: '62.5%',
                padding: '1.5%',
                marginLeft:'2.5%',
                marginRight:'2.5%',
                marginTop:'2.5%'
            }).text('Address');

            if (_data.acf.required_fields.indexOf('address') > -1){
                _address.div.placeholder = 'Address *';
            } else {
                _address.div.placeholder = 'Address';
            }

            _zip = _form.create('.zip', 'input');
            _zip.css({
                borderRadius:'8px',
                width: '30%',
                padding: '1.5%',
                marginTop:'2.5%'
            }).text('Zip Code');
            _zip.div.placeholder = 'Zip Code *';

            if (_data.acf.required_fields.indexOf('zip') > -1){
                _zip.div.placeholder = 'Zip *';
            } else {
                _zip.div.placeholder = 'Zip';
            }
        }
        
        //playList area (text color = #404242)
        _playList = _content.create('.playerTitle', 'p');
        _playList.css({
            fontFamily: 'Gotham SSm A, Gotham SSm B',
            textAlign: 'center',
            color: '#ffffff',
            paddingBottom:'2%'
        }).text('<strong><h3>Choose Your Top 5 Picks</h3></strong>');

        //Call function that loops through user input to create playlist
        _chartShowItems = _content.create('.chartShowItems');
        // _chartShowItems.css({margin:'0.5%'});
        _getChartShowSong();


        //Check if contest to be included 
        if (_data.acf.required_fields.indexOf('contest') > -1){

            //Enter a contest - win a prize
            _prize = _content.create('.prize', 'p');
            _prize.css({
                position:'relative',
                fontSize:'1em',
                color: '#fff',
                width:'100%',
                textAlign:'center',
                borderRadius:'12px'
            }).text('<h3>Contest</h3><br>Enter my name in Radio Milwaukee\'s contest:');

        } else {
            _prize = _content.create('.prize', 'p');
            _prize.css({display:'none'});
        }

        _prizeCheck = _prize.create('.prizeCheck', 'input');
        _prizeCheck.div.type = 'checkbox';
        _prizeCheck.css({visibility:'hidden'});

        _pDiv = _prize.create('.pDiv');
        _pDiv.css({
            position:'relative',
            padding:'2%'
        });

        _prizeBoxYes = _pDiv.create('.prizeBoxYes');
        _prizeBoxYes.size(32, 32).css({
            border: '2px solid #b0afac',
            background:'#fefefd',
            borderRadius:'5px',
            position:'absolute',
            display:'inline-block',
            left:'42%',
            top:'50%',
            lineHeight:'75%',
            transform:'translate(0, -50%)'
        });

        _prizeYesText = _pDiv.create('.prizeYesText', 'p');
        _prizeYesText.css({
            color:'#ffffff',
            textAlign:'center',
            position:'relative',
            display:'inline-block',
            verticalAlign:'middle',
            right:'2.5%'
        }).text('Yes');

        _prizeBoxNo = _pDiv.create('.prizeBoxNo');
        _prizeBoxNo.size(32, 32).css({
            border: '2px solid #b0afac',
            background:'#fefefd',
            borderRadius:'5px',
            position:'absolute',
            textAlign:'center',
            display:'inline-block',
            verticalAlign:'middle',
            left:'55%',
            top:'50%',
            lineHeight:'75%',
            transform:'translate(0, -50%)'
        });

        _prizeNoText = _pDiv.create('.prizeNoText');
        _prizeNoText.css({
            color:'#ffffff',
            position:'relative',
            display:'inline-block',
            textAlign:'center',
            verticalAlign:'middle',
            left:'9%'
        }).text('No');

        //Check if newsletter to be included
        if (_data.acf.required_fields.indexOf('news') > -1){

            //Subscribe to 88Nines Newsletter
            _newsletter = _content.create('.newsletter');
            _newsletter.css({
            fontFamily: 'Gotham SSm A, Gotham SSm B',
            position:'relative',
            fontSize:'1em',
            color: '#fff',
            width:'100%',
            textAlign:'center',
            borderRadius:'12px'
            }).text('<h3>Newsletter</h3><br>Subscribe to 88Nine\'s newsletter:');

        } else {
            _newsletter = _content.create('.newsletter', 'p');
            _newsletter.css({display:'none'});
        }

        _newsCheck = _newsletter.create('.newsCheck', 'input');
        _newsCheck.div.type = 'checkbox';
        _newsCheck.css({visibility:'hidden'});

        _nDiv = _newsletter.create('.nDiv');
        _nDiv.css({
            textAlign:'center',
            padding:'2%'
        });

        _newsBoxYes = _nDiv.create('.newsBoxYes');
        _newsBoxYes.size(32, 32).css({
          border: '2px solid #b0afac',
          background:'#fefefd',
          borderRadius:'5px',
          position:'absolute',
          display:'inline-block',
          left:'42%',
          top:'75%',
          lineHeight:'75%',
          transform:'translate(0, -50%)'
        });

        _newsYesText = _nDiv.create('.newsYesText', 'p');
        _newsYesText.css({
            color:'#ffffff',
            textAlign:'center',
            position:'relative',
            display:'inline-block',
            verticalAlign:'middle',
            right:'2.5%',
            lineHeight:'90%'
        }).text('Yes');

        _newsBoxNo = _nDiv.create('.newsBoxNo');
        _newsBoxNo.size(32, 32).css({
            border: '2px solid #b0afac',
            background:'#fefefd',
            borderRadius:'5px',
            position:'absolute',
            textAlign:'center',
            display:'inline-block',
            verticalAlign:'middle',
            left:'55%',
            top:'75%',
            lineHeight:'75%',
            transform:'translate(0, -50%)'
        });

        _newsNoText = _nDiv.create('.newsNoText');
        _newsNoText.css({
          color:'#ffffff',
          position:'relative',
          display:'inline-block',
          textAlign:'center',
          verticalAlign:'middle',
          left:'9%',
          lineHeight:'75%'
        }).text('No');

        //Submit button
        _submit = _content.create('.submit');
        _submit.css({
            color: '#fff',
            height:'15em',
            width:'100%',
            textAlign:'center',
            // border: '1px solid red'
        });

        //Success message
        _thankYouMsg = _submit.create('._thankYouMsg');
        _thankYouMsg.css({
            color: '#fff',
            width:'100%',
            textAlign:'center',
            display: 'none'
        }).text('<h3>Thank You for Entering</h3><br>Tune in to 88Nine Radio Milwaukee and listen for the results');

        //Error Messages
        _sorryMsg = _submit.create('._errorMsg');
        _sorryMsg.css({
            color: '#404242',
            width:'100%',
            textAlign:'center',
            display: 'none',
            fontSize: '2em',
            
        });

        //Add event listener to capture data via Ajax and send to existing PHP script for processing
        _submitButton = _submit.create('.submitButton');
        _submitButton.div.type = 'submit';
        _submitButton.css({
            fontFamily: 'Gotham SSm A, Gotham SSm B',
            background: 'rgba(0, 0, 0, 0.1)',
            border: '2px solid #404242',
            textAlign: 'center',
            marginTop: '5em',
            padding: '1em 3em 1em 3em',
            cursor: 'pointer',
            borderRadius:'18px',
            position:'relative',
            width: '10em',
            color:'#404242',
            display: 'inline-block'
        }).text('SUBMIT');

    }


    //Creates playlist
    function _getChartShowSong(){

        Ajax.get('/cs-player.php', null, function(json){
                
        var _json = JSON.parse(json);

          for (i = 0; i < _json.length; i++) {
            
            var songItem = _self.initClass(PageChartShowSong, _json[i]);

            _chartShowItems.add(songItem);
          
            _allSongItems.push(songItem);
          }

          var _clear = _chartShowItems.create('.clear');
          _clear.css({
            position: 'relative',
            width: '100%',
            clear: 'both'
          });

        });
    }


    //Post data via AJAX 
    function _postChartShowData(){
        var vote = [];

        _allSongItems.forEach(function (item, index) {
            var songStatus = item.checkForSong();

            if (songStatus === true) {
                vote.push(item.postID);
            }
            });

            var submitData = {
                post_id: _data.ID,
                name : _name.div.value,
                email : _email.div.value,
                phone : _phone.div.value,
                address : _address.div.value,
                zip : _zip.div.value,
                songCheck : vote,
                prizeCheck : _prizeCheck.div.value,
                newsCheck : _newsCheck.div.value
            };

            Ajax.post('/wp-content/plugins/chart-show/process.php', submitData, function(response) {
                if (response !== ''){
                  try {
                      var json = JSON.parse(response);
                        if (json == '88Nine Radio MKE thanks you for participating!')
                        { _successMsg();
                        }else if (json.indexOf('Please') > -1 === true){
                            _errorMsg(json);
                        }
                  } catch (error){
                      console.log(response);
                      console.log(error);
                  }
                }else{
                  if (Config.DEBUG.all){
                          console.log('Empty response');
                      }
                }
            }
        );
    }
     

    function _successMsg(){
        _about.tween({
                opacity: 0
            }, 0.33, Config.EASING.inout, null,

            function(){
                _about.css({ display: 'none' }
            );
        });

        _form.tween({opacity: 0}, 0.33, Config.EASING.inout, null, function(){
            _form.css({ display: 'none' });
        });
        _prize.tween({opacity: 0}, 0.33, Config.EASING.inout, null, function(){
            _prize.css({ display: 'none' });
        });
        _newsletter.tween({opacity: 0}, 0.33, Config.EASING.inout, null, function(){
            _newsletter.css({ display: 'none'});
        });
        _playList.tween({opacity: 0}, 0.33, Config.EASING.inout, null, function(){
            _playList.css({ display: 'none' });
        });
        _chartShowItems.tween({opacity: 0}, 0.33, Config.EASING.inout, null, function(){
            _chartShowItems.css({ display: 'none' });
        });
        _submitButton.tween({opacity: 0}, 0.33, Config.EASING.inout, null, function(){
            _submitButton.css({ display: 'none' });
        });
        _sorryMsg.css({display: 'none'});
        _thankYouMsg.css({display:'block'});
        _thankYouMsg.tween({opacity: 1}, 0.01, Config.EASING.inout);
    }

    function _errorMsg(message){
        _sorryMsg.css({display: 'block'}).text(message);
    }


    //Checkbox functions for Newsletter and Contest Sign up
    function checkPrize (event){
        _prizeCheck.div.checked = true;
        _prizeCheck.div.setAttribute('value', 1);
        _prizeBoxYes.css({
            border:'2px solid #f9971c',
            fontFamily: "FontAwesome",
            color: '#f9971c'
        }).text("&#xf00d;");
        _prizeBoxNo.css({
            border: '2px solid #b0afac'
        }).text('');
    }

    function unCheckPrize (event){
        _prizeCheck.div.checked = false;
        _prizeCheck.div.setAttribute('value', 0);
        _prizeBoxNo.css({
            border:'2px solid #f9971c',
            fontFamily: "FontAwesome",
            color: '#f9971c'
        }).text("&#xf00d;");
        _prizeBoxYes.css({
            border: '2px solid #b0afac',
        }).text('');
    }

    function checkNews (event){
        _newsCheck.div.checked = true;
        _newsCheck.div.setAttribute('value', 1);
        _newsBoxYes.css({
            border:'2px solid #f9971c',
            fontFamily: "FontAwesome",
            color: '#f9971c'
        }).text("&#xf00d;");
        _newsBoxNo.css({
            border: '2px solid #b0afac',
        });
        _newsBoxNo.text('');
    }

    function unCheckNews (event){
        _newsCheck.div.checked = false;
        _newsCheck.div.setAttribute('value', 0);
        _newsBoxNo.css({
            border:'2px solid #f9971c',
            fontFamily: "FontAwesome",
            color: '#f9971c'
        }).text("&#xf00d;");
        _newsBoxYes.css({
            border: '2px solid #b0afac',
        });
        _newsBoxYes.text('');
    }

    //Hover state Newsletter checkboxes
    function newsBoxOverYes(){
      _newsBoxYes.css({
        border:'2px solid #f9971c'
      });
    }

    function newsBoxOutYes(){
      _newsBoxYes.css({
        border: '2px solid #b0afac'
      });  
    }

    function newsBoxOverNo(){
      _newsBoxNo.css({
        border:'2px solid #f9971c'
      });
    }

    function newsBoxOutNo(){
      _newsBoxNo.css({
        border: '2px solid #b0afac'
      });  
    }

    //Hover state Contest checkboxes
    function prizeBoxOverYes(){
      _prizeBoxYes.css({
        border:'2px solid #f9971c'
      });
    }

    function prizeBoxOutYes(){
      _prizeBoxYes.css({
        border: '2px solid #b0afac'
      });  
    }

    function prizeBoxOverNo(){
      _prizeBoxNo.css({
        border:'2px solid #f9971c'
      });
    }

    function prizeBoxOutNo(){
      _prizeBoxNo.css({
        border: '2px solid #b0afac'
      });  
    }

    //Hover state for submit button
    function submitOver(){
      _submitButton.css({
        border:'2px solid #f9971c',
        color:'#f9971c'
      });
    }

    function submitOut(){
      _submitButton.css({
          border: '2px solid #404242',
          color:'#404242'
      });
    }

    //Call all EVENT listeners...
    function _events() {
        //Contest event listeners
        Evt.subscribe(_prizeBoxYes.div, Evt.CLICK, checkPrize);
        Evt.subscribe(_prizeBoxNo.div, Evt.CLICK, unCheckPrize);

        _prizeBoxNo.interact({
            onOver: prizeBoxOverNo,
            onOut: prizeBoxOutNo
          });

        _prizeBoxYes.interact({
            onOver: prizeBoxOverYes,
            onOut: prizeBoxOutYes
          });

        //Newsletter event listeners
        Evt.subscribe(_newsBoxYes.div, Evt.CLICK, checkNews);
        Evt.subscribe(_newsBoxNo.div, Evt.CLICK, unCheckNews);

        _newsBoxNo.interact({
            onOver: newsBoxOverNo,
            onOut: newsBoxOutNo
          });

        _newsBoxYes.interact({
          onOver: newsBoxOverYes,
          onOut: newsBoxOutYes
        });

        //Capture and store all data on page
        _submitButton.interact({
            onOver: submitOver,
            onOut: submitOut,
            onClick: _postChartShowData
          });
          
        //Resize
        Evt.subscribe(window, Evt.RESIZE, _onResize);
    }

    function _onResize() {
        var _fontSize = Math.max(Stage.width * (13.6/1440), 10);
        // var _fontsizeTitle = _fontSize * (26/13.6);
        // _chartShowItems.css({margin:'0.5%'});

        _content.css({
        fontSize: _fontSize + 'px',
        lineHeight: '1.75em'
        });

        if (Device.mobile.phone) {
            _prizeBoxYes.css({left:'34%', zIndex:'100'});//contest checkbox
            _prizeBoxNo.css({display:'block', zIndex:'100'});
            _prize.css({zIndex: '-100'});
            _newsBoxYes.css({left:'34%', zIndex:'100'});//newsletter checkbox
            _newsBoxNo.css({display:'block', zIndex:'100'});
            _prizeNoText.css({left:'18%'});//contest
            _prizeBoxNo.css({fontSize:'3.5em'});
            _prizeYesText.css({left:'0%'});
            _prizeBoxYes.css({fontSize:'3.5em'});//newsletter
            _newsletter.css({zIndex: '-100'});
            _newsNoText.css({left:'18%'});
            _newsBoxNo.css({fontSize:'3.5em'});
            _newsYesText.css({left:'0%'});
            _newsBoxYes.css({fontSize:'3.5em'});
            _pDiv.css({zIndex:'-10'});
            _nDiv.css({zIndex:'-10', padding:'4%'});
        }else if (Stage.width < 900){
            _prizeBoxYes.css({display:'block'});//contest checkbox
            _prizeBoxNo.css({display:'block'});
            _newsBoxYes.css({display:'block'});//newsletter checkbox
            _newsBoxNo.css({display:'block'});
            _prizeNoText.css({left:'12%'});//contest
            _prizeBoxNo.css({fontSize:'3.5em'});
            _prizeYesText.css({left:'1.5%'});
            _prizeBoxYes.css({fontSize:'3.5em'});//newsletter
            _newsNoText.css({left:'12%'});
            _newsBoxNo.css({fontSize:'3.5em'});
            _newsYesText.css({left:'1.5%'});
            _newsBoxYes.css({fontSize:'3.5em'});
        }else if (Stage.width < 1190) {
            _prizeNoText.css({left:'12%'});//contest
            _prizeBoxNo.css({fontSize:'3.2em'});
            _prizeYesText.css({left:'1.5%'});
            _prizeBoxYes.css({fontSize:'3.2em'});//newsletter
            _newsNoText.css({left:'12%'});
            _newsBoxNo.css({fontSize:'3.2em'});
            _newsYesText.css({left:'1.5%'});
            _newsBoxYes.css({fontSize:'3.2em'});
        }else if (Stage.width < 1325) {
            _prizeNoText.css({left:'9%'});//contest
            _prizeBoxNo.css({fontSize:'2.9em'});
            _prizeYesText.css({right:'2.5%'});
            _prizeBoxYes.css({fontSize:'2.9em'});//newsletter
            _newsNoText.css({left:'9%'});
            _newsBoxNo.css({fontSize:'2.9em'});
            _newsYesText.css({right:'2.5%'});
            _newsBoxYes.css({fontSize:'2.9em'});
        }else{
            _prizeBoxNo.css({fontSize:'2.5em'});
            _prizeBoxYes.css({fontSize:'2.5em'});
            _newsBoxNo.css({fontSize:'2.5em'});
            _newsBoxYes.css({fontSize:'2.5em'});
        }
    }

});