define(function() {

	function _win(src,bgColor,winWidth,winHeight, title){
		this.src = src;
		this.doc = document;
		if(!src || arguments.length < 1){
			alert('弹出窗口至少需要一个url参数!');
			throw new Error('popup runtime error!');
		}
		if((!winWidth && winHeight) || (winWidth && !winHeight)){
			alert('窗口宽度和高度需要同时输入!');
			throw new Error('popup runtime error!');
		}
		
		this.bgColor = !bgColor ? "#FFF" : bgColor;
		this.winWidth = winWidth;
		this.winHeight = winHeight;
		this.title = title;
		
		return this;
	};
	
	_win.prototype.setBg = function () {
		var body = document.body;
		var docEle = this.doc.documentElement;

		var height = Math.max(
		        Math.max(body.scrollHeight, docEle.scrollHeight),
		        Math.max(body.offsetHeight, docEle.offsetHeight),
		        Math.max(body.clientHeight, docEle.clientHeight));
		var bgDivStyle = this.doc.getElementById('locklayer').style;;
		var width = window.screen.availWidth;
		bgDivStyle.width = width + "px";
		bgDivStyle.height = height + "px";
	};
	
	_win.prototype.showFrameContent = function (){
		var iframe = document.getElementById("helpFrame");
		iframe.src = this.src;
	};
	
	_win.prototype.showFrame = function(){
		this.doc.getElementById("helpFrame").className = "frameDisplay";
		this.doc.getElementById("popupWin").className = "popwinDisplay";
		this.doc.getElementById('locklayer').className = "bg";
	};
	
	_win.prototype.changeCss = function(){
		var sheet = this.doc.styleSheets[0];
		var rules = sheet.cssRules ? sheet.cssRules : sheet.rules;
		var rulesLen = rules.length;
		if(this.winWidth && this.winHeight){
			if(sheet.insertRule){
					sheet.insertRule('div.popwinDisplay{' + 
										'width:'+ this.winWidth + 'px;' + 
										'height:' + this.winHeight + 'px;'  + 
										'margin-left:-' + parseInt(this.winWidth)/2 + 'px;' +
										'margin-top:-' + parseInt(this.winHeight)/2 + 'px;' +
									'}',rulesLen);
					sheet.insertRule('iframe.frameDisplay{' + 
										'height:' + (parseInt(this.winHeight) - 40) + 'px;' +
									'}',rulesLen + 1);
					sheet.insertRule('div.cmd,iframe.frameDisplay{' + 
									'width:' + (parseInt(this.winWidth) - 0) + 'px;' +
							'}',rulesLen + 2);
					if(this.bgColor != null){
						sheet.insertRule('div.popwinDisplay{' + 'background-color:' + this.bgColor +';}',rulesLen + 3);
					}else{
						sheet.insertRule('div.popwinDisplay,div.cmd{' + 'background-color:transparent;}',rulesLen + 3);
						sheet.insertRule('div.popwinDisplay{border:0 none;}',rulesLen + 4);
					}
			}else if(sheet.addRule){
				sheet.addRule('div.popwinDisplay',
						'width:'+ this.winWidth + 'px;' + 
						'height:' + this.winHeight + 'px;'  + 
						"margin-left:-" + parseInt(this.winWidth)/2 + 'px;' +
						"margin-top:-" + parseInt(this.winHeight)/2 + 'px;',
						rulesLen);
				sheet.addRule('iframe.frameDisplay',
									'height:' + (parseInt(this.winHeight) - 40) + 'px;' +
									'width:' + (parseInt(this.winWidth) - 0) + 'px;',
									rulesLen + 1);
				sheet.addRule('div.cmd',
									'width:' + (parseInt(this.winWidth) - 0) + 'px;' +
									'text-align:right;color:red;',
									rulesLen + 2);
				if(this.bgColor != null){
					sheet.addRule('div.popwinDisplay', 'background-color:' + this.bgColor +';', rulesLen + 3);
				}else{
					sheet.addRule('div.popwinDisplay', 'background-color:transparent;border:0 none;', rulesLen + 3);
					sheet.addRule('div.cmd', 'background-color:transparent', rulesLen + 4);
				}
			}
		}
	};
	
	_win.prototype.close = function (){
		this.doc.getElementById('popupWin').className
		= this.doc.getElementById('locklayer').className = "hide";
		this.doc.getElementById('locklayer').style.height = document.getElementById('locklayer').style.width = "0px";
		this.doc.getElementById("helpFrame").src = '';
	};
	
	_win.prototype.open = function(){
		if(!document.getElementById('popupWin')){
			this.createShowArea();
		}
		this.setBg();
		this.showFrame();
		this.showFrameContent();
		this.changeCss();
		document.getElementById('winTitle').innerHTML = this.title;//TODO:修改
		
		return this;
	};
	
	_win.prototype.delHeadBar = function(){
		document.getElementById('popCmd').style.display = "none";
		document.getElementById('popupWin').style.borderWidth = "0";
		document.getElementById('popupWin').style.borderColor = "#fff";
		
		return this;
	};
	
	_win.prototype.createShowArea = function(){
		var popupArea = document.createElement('div');
		var popupWin = document.createElement('div');
		popupWin.setAttribute('id','popupWin');
		popupWin.setAttribute('class','hide');
		var cmd = document.createElement('div');
		cmd.setAttribute('class','cmd');
		cmd.setAttribute('id','popCmd')
		cmd.style.textAlign = "left";//only for IE7 and IE6
		var a = document.createElement('a');
		a.setAttribute('href','javascript:void(0)');
		a.setAttribute('id','winTitle');
		var thiswin = this;
		if(document.attachEvent){
			a.attachEvent('onclick',function(){
				//new windowAPI.win().close();
				//thiswin.close();
			});
		}else if(document.addEventListener){
			a.addEventListener('click',function(){
				//new windowAPI.win().close();
				//thiswin.close();
			},false);
		}
		if(this.bgColor){
			a.innerHTML = this.title;
			a.style.textDecoration = "none";
		}
		
		var helpFrame = document.createElement('iframe');
		helpFrame.setAttribute('id','helpFrame');
		helpFrame.setAttribute('name','helpFrame');
		helpFrame.setAttribute('frameborder','0');
		helpFrame.setAttribute('scrolling','no');
		helpFrame.setAttribute('src','');
		helpFrame.setAttribute('class','frameInit');
		helpFrame.frameBorder = "0";//for IE
		var locklayer =  document.createElement('div');
		locklayer.setAttribute('id','locklayer');
		
		cmd.appendChild(a);
		popupWin.appendChild(cmd);
		popupWin.appendChild(helpFrame);
		popupArea.appendChild(popupWin);
		popupArea.appendChild(locklayer);
		
		if(document.body){
			document.body.appendChild(popupArea);
		}else{
			var bd = document.createElement('body');
			bd.appendChild(popupArea);
			document.appendChild(bd);
		}
	};
	
	function initCss() {
		document.writeln('<style type="text\/css">');
		document.writeln('.hide{display:none;width:0;height:0;}');
		document.writeln('.bg{background: #000000 none; filter:alpha(opacity=30); opacity: 0.3; position: absolute; left: 0px; top: 0px; z-index: 100;}');
		document.writeln('.frameInit{width:0;height:0;display:none;}');
		document.writeln('.popwinDisplay{display:block;overflow:hidden;' + 
				'width:500px;' +
				'height:500px;' +/*460(iframe)  + 27(button) + 13(空白)*/
				'z-index:101;position:absolute;left:50%;top:50%;border:15px solid #666;background:#FFF none;' +
				'margin-left:-250px;' + 
				'margin-top:-250px;}');
		document.writeln('.frameDisplay{display:block;overflow:hidden;' + 
				'height:460px;' + 
				'border:0 none;margin:0;padding:0;top:8px;}');
		document.writeln('.cmd{padding-left:3px;background:url(img/popTile.jpg) repeat-x scroll 0 0 transparent;text-align: right;line-height: 35px;border:1px solid #3B5998;}');
		document.writeln('.cmd,.frameDisplay{margin:0 auto;' + 
				'width:480px;}');
		document.writeln('.cmd a{font-size: 14px;font-weight: bold;color:#FFF;}');
		document.writeln('.cmd a{margin-left: 6px;}');
		document.writeln('.cmd a{cursor:default;}');
		document.writeln('<\/style>');
	};
	
	return {
		win: _win,
		openWindow:  function(cfg) {
			var src = cfg.url,
				color = cfg.bgColor,
				width = cfg.width,
				height = cfg.height, 
				title = cfg.title;
			var win = new _win(src, color, width, height, title);
			win.open();
		},
		closeWindow: function() {
			var doc = document.getElementById('popupWin') ? document : parent.document;
			if (!doc.getElementById('popupWin')) {
				return;
			}
			doc.getElementById('popupWin').className = doc.getElementById('locklayer').className = "hide";
			doc.getElementById('locklayer').style.height = doc.getElementById('locklayer').style.width = "0px";
			doc.getElementById("helpFrame").src = '';
		},
		initCss: initCss
	};

});