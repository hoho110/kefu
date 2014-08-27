define(["module/cfg"], function(userConf){
	
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var _fd = function(longt) {
		var date = null;
		if (typeof longt == 'number') {
			date = new Date(longt);
		} else if (longt instanceof Date) {
			date = longt;
		} else {
			return null;
		}
		var yyyy = date.getFullYear();
		var MM = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
		var dd = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
		var HH = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
		var mm = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
		var ss = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds();
		return {
			'yyyy' : yyyy,
			'MM' : MM,
			'dd' : dd,
			'HH' : HH,
			'mm' : mm,
			'ss' : ss
		}
	};
	String.prototype.removeLineEnd = function()
	{
	    return this.replace(/(<.+?\s+?)(?:\n\s*?(.+?=".*?"))/g,'$1 $2');
	};
	var getPrefix = function getPrefix(prefixIndex)
	{
	    var span = '    ';
	    var output = [];
	    for(var i = 0 ; i < prefixIndex; ++i)
	    {
	        output.push(span);
	    }
	    
	    return output.join('');
	};
	
	/**
	 * 将 Byte 数转化为 KB, MB, GB ... 的函数
	 * @param size 字节数，Number类型
	 */
	function convertSize(size) {
	    if(!size) {
	        return '0 Bytes';
	    }
	    var sizeNames = [' Bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
	    var i = Math.floor(Math.log(size)/Math.log(1024));
	    var p = (i > 1) ? 2 : 0;
	    return (size/Math.pow(1024, Math.floor(i))).toFixed(p) + sizeNames[i];
	}
	
	// 私有方法，动态设定datatable的列宽度
	function computTableLayout(config) {
		var aoColumns = [], 
		totalColWidth = 0, // 所有列的宽度总和
		// 分别定义默认的首列宽度、末列宽度、其他列宽度
		FIRST_COL_WIDTH = 100,
		LAST_COL_WIDTH = 150,
		OTHER_COL_WIDTH = 120; 
		
		// 获取列总数
		var columnCnt;
		if (typeof(config.columnCnt) == "undefined") {
			try {
				columnCnt = $($("#" + config.tableId).find("tr")[0]).children().length; 
			} catch(e) {
				this.console.log("获取列数失败!");
				throw new Error("failure when trying to get column number!");
			} 
		} else {
			columnCnt = config.columnCnt;
		}
		if (config.columnsTitle) { //TODO:补充api的columnsTitle属性
			var titleCnt = config.columnsTitle.length;
			if (titleCnt != columnCnt) {
				alert("列数和列名称个数应该相等!");
				throw("columns number not match with titles number!");
			}
		}
		
		// 如果没有各列宽度配置相关的参数，此处进行设置
		if (typeof(config.columnsWidth) == "undefined") {
			for (var i = 0, l = columnCnt; i < l; i++) {
				var _sWidth;
				if (i == 0) { // 第一列为序号列，宽度相对小一些
					//aoColumns.push({sWidth: FIRST_COL_WIDTH});
					_sWidth = FIRST_COL_WIDTH;
					totalColWidth += FIRST_COL_WIDTH;
				} else {
					if (i != l - 1) { //除第1列外的非最后一列
						//aoColumns.push({sWidth: OTHER_COL_WIDTH});
						_sWidth = OTHER_COL_WIDTH;
						totalColWidth += OTHER_COL_WIDTH;
					} else {  
						//aoColumns.push({sWidth: LAST_COL_WIDTH}); //最后一列的宽度
						_sWidth = LAST_COL_WIDTH;
						totalColWidth += LAST_COL_WIDTH;
					}
				}
				if (config.columnsTitle) {
					aoColumns.push({
						sWidth: _sWidth,
						sTitle: config.columnsTitle[i]
					});
				} else {
					aoColumns.push({sWidth: _sWidth});
				}
			}
		// 如果有各列宽度配置相关的参数，此处进行处理
		} else {
			if (!$.isArray(config.columnsWidth)) {
				alert("各列宽度的配置必须为数组类型!");
				throw new Error("array definition error!");
			} 
			if (config.columnsWidth.length != columnCnt) {
				alert("列宽度对应的列数必须与总列数相等!");
				throw new Error("column count not equal to columnWidth's length!");
			}
			for (var i = 0, l = config.columnsWidth.length; i < l; i++) {
				var _width = config.columnsWidth[i];
				aoColumns.push({sWidth: _width});
				totalColWidth += _width;
			}
		}
		
		// 确定各列宽度总和与表格所在容器宽度的比例关系
		var scrollX = totalColWidth/$("#dynamicData").width();
		
		// 对具有滚动条的配置时，进行的处理
		var scrollCfg = {};
		if (scrollX > 1) { // 表格宽度大于表格容器提供的宽度
			scrollCfg = {
				"bScrollCollapse": true,
				/**
				 * 表格的宽度
				 * 经FF的version23.0.1测试，该值的大小更改对表格没有影响。建议此处保留100%不坐变动即可。
				 */
				"sScrollX": "100%", 
				/**
				 * 表格占原有容器(盛放datatable的div容器)的百分比，默认情况下(bScrollCollapse=false)占用100%
				 * 此处根据实际情况调整（一般我们做的更改是变宽的情况，即增大该值）
				 * 具体值自己根据对应表格的情况而定。
				 */
				"sScrollXInner": Math.round(scrollX*100) + "%"
			};
		// 表格宽度小于容器宽度的情况
		} else {
			//var realEvenWidth = $("#dynamicData").width()/columnCnt;
			var realLastColWidth = $("#dynamicData").width() - (totalColWidth - LAST_COL_WIDTH);
			/**
			 * 如果实际最后一列的宽度大于假定最后一列宽度的2倍，则平均各列宽度。根据表格特性：
			 * 表格宽度一定(占用父div的100%)宽度时：
			 * (1) 最后一列宽度值如果不设定，其宽度由差值决定(近似等于总宽-其他各列宽度)
			 * (2) 如果设定，则各列宽度不确定。一般来说，列宽值大的较宽，但不成比例
			 */
			if ((realLastColWidth/LAST_COL_WIDTH) > 2) { // 决定进行平均时的比例，当前按2确定，可修正
				for (var i = 0, colWidth = Math.floor(100/columnCnt) + "%"; i < columnCnt; i++) {
					aoColumns[i].sWidth = colWidth;
				}
			}
		}
		
		return {
			aoColumns: aoColumns,
			scrollCfg: scrollCfg
		}
	}
	
	return {
		convertSize: convertSize,
		
		
		/**
		 * 国际化相关处理，调用形如：translate({"true":"是","false": "否"}, [true, false, true])
		 * @param  第1个参数，对象类型，表示国际化映射，如:{"true":"是","false": "否"}
		 * @param  第2个参数，数组类型，表示需要国际化的变量，如：[true, false, true]
		 * 返回，国际化后的变量，例如本例的结果为：["是", "否", "是"]
		 */
		translate: function() {
			var args = arguments, 
				translator = args[0], 
				originNames = args[1];
			if (typeof translator !== "object") {
				alert("第一个参数必须为对象类型");
				throw "translation error!";
			}
			if (Object.prototype.toString.call(originNames) != "[object Array]") {
				alert("第二个参数必须为数组!");
				throw "translation error!";
			}
			var rt = [];
			for (var i = 0, l = originNames.length; i < l; i++) {
				var newName = originNames[i];
				if (translator[newName]) {
					newName = translator[newName];
				}
				rt.push(newName);
			}
			
			return rt;
		},
		
		/**
		 * 获取对象的级联属性值。
		 * 如:obj = {
		 * 	prop1: {
		 * 		prop11: "prop11Value"
		 * 	}
		 * };
		 * getPropertyValue(obj, "prop1.prop11") === "prop11Value" 
		 */
		getPropertyValue: function(obj, property) {
			var propArray = property.split(".");
			for (var i = 0; i < propArray.length; i++) {
				if (obj[propArray[i]] != null && obj[propArray[i]] != undefined) {
					obj = obj[propArray[i]];
				} else {
					return "";
				}
			}
			return obj;
		},
		
		/**
		 * 分辨率提示
		 */
		compareScrResolution: function(){
			var h = screen.height;
			var w = screen.width;
			if (h < 768 || w < 1024) {
				$("#noResolutionTip").html('系统支持分辨率:1024*768以上');
				$('#screenTips').html('很抱歉，当前的显示率分辨率过低，影响了页面效果，建议调整分辨率到1024*768以上。');
			}
		},
		
		// 首页加载完成后，根据浏览器分辨率动态调整列表显示区域的宽度
		adjustWidthOfDataArea: function() {
				
			/**
			 * html中的body宽度，包括了margin、padding等，但不包括右边可能具有的滚动条宽度
			 * 该宽度根据系统分辨率的不同进行动态获取
			 */
			var bodyWidth = $(document.body).width();
			
			var	lrPaddingsWidth = 10 * 2, // id为"content"的内容区域左右padding宽度各10，由css控制
				treeMenuWidth = 185, // 按钮所在区域的宽度，由css控制
				isolationStrip = 30, // 按钮区域和列表区域之间的空白间隔，设定为30
				surplus = 2; // 为保证足够盛放动态数据列表，空余2个像素放在动态数据列表和浏览器右边界(如有右滚动条，为该滚动条)
			
			var dynamicAreaWidth = bodyWidth - lrPaddingsWidth - treeMenuWidth - isolationStrip - surplus;
			$("#dynamicData").width(dynamicAreaWidth);
		},
		
		/**
		 * 封装datatable显示方式。
		 * 如果表格各列宽度总和，大于表格所在容器(页面中id为"dynamicData"的div)，则表格出现滚动条
		 * 如果小于，则不出现滚动条，正常显示
		 * 
		 * @param config, JS对象类型，表示表格相应的参数，包括tableId、columnCnt、sortColumn、columnsWidth4个属性：
		 * tableId，必备，String类型，页面中需要进行datatable展示的table对应的id，注意不包含"#"。一般情况，只需要该属性即可。
		 * columnCnt，可选，Number类型，表格具有的总列数。如果缺省，数值为tableId具有的列数。建议缺省即可。
		 * sortColumn，可选，Array类型，表示列需要(从1开始)，展示时按这些列进行排序。如果缺省，按第1列进行排序。
		 * columnsWidth，可选，Array类型，对各个列的宽度配置。如果缺省，按默认格式进行宽度设置
		 * 
		 * 调用例子如下：
		 * util.showByDataTable({
				tableId: "fieldTypeTable",
				columnCnt: 8,
				sortColumn: [3],
				columnsWidth: [60, 100, 100, 100, 100, 100, 100, 200] // 注意数组长度与columnCnt的值相等，否则会报异常
			}); 
		 *此外，可选的第2个参数为JS对象类型，表示其他datatable的配置参数，即jquery的datatable标准参数。示例如下：
			 util.showByDataTable({
				 tableId: "dataCommonField"  // 必备，一般情况，只需要该属性即可，注意不包含"#"
				 // 其他可选参数
			 },{
				 bFilter:false, //不启用客户端过滤功能(属于dataTable插件API中标准参数，下同)
				 bSort: false // 不启用列排序
			 });
		 * 
		 */
		showByDataTable: function(config, otherConf) {
			if (!config) {
				alert("必须提供配置参数!");
				throw new Error("no config error!");
			}
			if (typeof config != "object") {
				alert("参数错误:必须为Object类型!");
				throw new Error("para type error!");
			}
			if (typeof(config.tableId) == "undefined") {
				alert("必须提供表格id,对应属性为tableId!");
				throw new Error("table id not exist!");
			}
			if (config.tableId.indexOf("#") != -1) {
				alert("tableId不需要带'#'!");
				throw new Error("error char '#'!");
			}
			if ($("#" + config.tableId).length == 0) {
				alert("不存在id为'" + config.tableId + "'的table,请检查!");
				throw new Error("table id error!");
			}
			if (!config.sortColumn || config.sortColumn.length == 0) {
				config.sortColumn = [1]; // 默认按第2列排序
			} else {
				if (!$.isArray(config.sortColumn)) {
					alert("排序列的配置必须为数组类型!");
					throw new Error("array definition error!");
				}
			}
			var layoutInfo = computTableLayout(config);
			var tableConfig = $.extend({
				"bJQueryUI": 		true,
				"sPaginationType": 	"full_numbers",
				"oLanguage": 		userConf.dataTableI18n,		
				"aoColumnDefs":		[{"aTargets": config.sortColumn, "bSortable": true}],	
				"aoColumns": 		layoutInfo.aoColumns	
			}, layoutInfo.scrollCfg, (otherConf ? otherConf : {}));
			
			// 调用datatable的API进行相应显示
			$("#" + config.tableId).dataTable(tableConfig);
		},
		
		// 设定datatable服务器端分页时的列宽度布局
		/**
		 * 设定datatable服务器端分页时的列宽度布局
		 * @param colomnCnt, 列数, 必备参数, Number类型
		 * @param columnsTitle, 各列的title,必备参数, Array类型。例如:["序号", "名称", "资源类型"]
		 * @return JS对象类型，包括如下2个属性：
		 * 		aoColumns: 以上提及的同名属性
		 * 		scrollCfg: 对滚动条的配置
		 */
		setServerSideLayout: function(columnCnt, columnsTitle) {
			return computTableLayout({
				columnCnt: columnCnt,
				columnsTitle: columnsTitle
			});	
		},
		
		/**
		 * 对各种服务调用的异常处理，但不包含会话过期的处理
		 * TODO：可以补充其他的异常情况
		 * @param e JS对象类型，异常
		 */
		handleError: function(e) {
			var errMsg = e._t_ || e.message || e.toString();
			
			// 判断权限
			if( errMsg.indexOf("AccessControlException") != -1 || errMsg.indexOf("您没有权限访问") != -1) {
				alert("权限错误!");
			}
			throw new Error("uitl.handleError, exception:" + errMsg);
		},
		/**日期格式化**/
		formatDate : function(longt) {
			if (typeof longt == "undefined") {
				return "";
			}
			//yyyy-MM-dd T HH:mm:ss
			var r = _fd(longt);
			var ldStr = r.yyyy + '-' + r.MM + '-' + r.dd + '  ' + r.HH + ':' + r.mm + ':' + r.ss;
			return ldStr;
		},
		/**日期格式化 end**/
		/*!
		Math.uuid.js (v1.4)
		http://www.broofa.com
		mailto:robert@broofa.com

		Copyright (c) 2010 Robert Kieffer
		Dual licensed under the MIT and GPL licenses.
		*/

		/*
		 * Generate a random uuid.
		 *
		 * USAGE: Math.uuid(length, radix)
		 *   length - the desired number of characters
		 *   radix  - the number of allowable values for each character.
		 *
		 * EXAMPLES:
		 *   // No arguments  - returns RFC4122, version 4 ID
		 *   >>> Math.uuid()
		 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
		 *
		 *   // One argument - returns ID of the specified length
		 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
		 *   "VcydxgltxrVZSTV"
		 *
		 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
		 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
		 *   "01001010"
		 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
		 *   "47473046"
		 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
		 *   "098F4D35"
		 */
		uuid : function(len, radix) {
			var chars = CHARS, uuid = [], i;
			radix = radix || chars.length;

			if (len) {
				// Compact form
				for (i = 0; i < len; i++)
					uuid[i] = chars[0 | Math.random() * radix];
			} else {
				// rfc4122, version 4 form
				var r;

				// rfc4122 requires these characters
				uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
				uuid[14] = '4';

				// Fill in random data.  At i==19 set the high bits of clock sequence as
				// per rfc4122, sec. 4.1.5
				for (i = 0; i < 36; i++) {
					if (!uuid[i]) {
						r = 0 | Math.random() * 16;
						uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
					}
				}
			}

			return uuid.join('');
		},
		uuidFast : function() {
			var chars = CHARS, uuid = new Array(36), rnd = 0, r;
			for ( var i = 0; i < 36; i++) {
				if (i == 8 || i == 13 || i == 18 || i == 23) {
					uuid[i] = '-';
				} else if (i == 14) {
					uuid[i] = '4';
				} else {
					if (rnd <= 0x02)
						rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
					r = rnd & 0xf;
					rnd = rnd >> 4;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
			return uuid.join('');
		},
		uuidCompact : function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		},
		/**Math.uuid.js end**/
		
		/**xml的字符串 格式化**/
		formatXml : function formatXml(text){
		    //去掉多余的空格
		    text = '\n' + text.replace(/(<\w+)(\s.*?>)/g,function($0, name, props)
		    {
		        return name + ' ' + props.replace(/\s+(\w+=)/g," $1");
		    }).replace(/>\s*?</g,">\n<");
		    
		    //把注释编码
		    text = text.replace(/\n/g,'\r').replace(/<!--(.+?)-->/g,function($0, text)
		    {
		        var ret = '<!--' + escape(text) + '-->';
		        //alert(ret);
		        return ret;
		    }).replace(/\r/g,'\n');
		    
		    //调整格式
		    var rgx = /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
		    var nodeStack = [];
		    var output = text.replace(rgx,function($0,all,name,isBegin,isCloseFull1,isCloseFull2 ,isFull1,isFull2){
		        var isClosed = (isCloseFull1 == '/') || (isCloseFull2 == '/' ) || (isFull1 == '/') || (isFull2 == '/');
		        //alert([all,isClosed].join('='));
		        var prefix = '';
		        if(isBegin == '!')
		        {
		            prefix = getPrefix(nodeStack.length);
		        }
		        else 
		        {
		            if(isBegin != '/')
		            {
		                prefix = getPrefix(nodeStack.length);
		                if(!isClosed)
		                {
		                    nodeStack.push(name);
		                }
		            }
		            else
		            {
		                nodeStack.pop();
		                prefix = getPrefix(nodeStack.length);
		            }

		        
		        }
		            var ret =  '\n' + prefix + all;
		            return ret;
		    });
		    
		    var prefixSpace = -1;
		    var outputText = output.substring(1);
		    //alert(outputText);
		    
		    //把注释还原并解码，调格式
		    outputText = outputText.replace(/\n/g,'\r').replace(/(\s*)<!--(.+?)-->/g,function($0, prefix,  text)
		    {
		        //alert(['[',prefix,']=',prefix.length].join(''));
		        if(prefix.charAt(0) == '\r')
		            prefix = prefix.substring(1);
		        text = unescape(text).replace(/\r/g,'\n');
		        var ret = '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix ) + '-->';
		        //alert(ret);
		        return ret;
		    });
		    
		    return outputText.replace(/\s+$/g,'').replace(/\r/g,'\r\n');

		},
		/**xml的字符串 格式化 end**/
		
		/**
		 * 删除数组元素
		 * @param dx, 元素的索引0,1,2...
		 * 注意实现方式：没有使用Array.prototype.remove的方式扩充数组类Array
		 * 使用时：util.remove.call(["a","b","c"], 1) 的结果为 新数组["a", "c"]
		 */
		remove: function(dx) {
			if (isNaN(dx) || dx > this.length) {
				return false;
			}
			for (var i = 0, n = 0; i < this.length; i++) {
				if (this[i] != this[dx]) {
					this[n++] = this[i];
				}
			}
			this.length -= 1;
			
			return this;
		},

		/**
		 * 将List<Object>转换为Map<propName, Object>，其中Object为Bean对象(后台的EJB实体对应的JSON)
		 * 如果List长度为0，则返回空map
		 * @param list 前端java.util.ArrayList类型，里面的每个元素为后台某个实体类
		 * @param propName 属性名称，如果缺省，则使用实体对应的id作为属性
		 */
		list2Map: function(list, propName) {
			var _property = (propName ? propName : "id");
			var rt = new java.util.HashMap();
			for (var i = 0, l = list.size(); i < l; i++) {
				var obj = list.get(i);
				rt.put(obj[_property], obj);
			}
			
			return rt;
		},
		
		
		/**
		 * 对window.console进行封装
		 * 兼容不支持window.console的浏览器(如IE7及以下)
		 * 调用方式：util.console.log("this is log info")
		 */
		console: (window.console ? window.console : {
			log: function(out) {},
			error: function(out) {}
		}),
		
		/**
		 * 将包含时分秒的日期字符串转换为JS Date类型
		 * 如果转换不成功，返回当前时间
		 * @param dataString, 日期字符串，形如:"2013-12-03 10:45:32"
		 * @return 对应的Date类型
		 */
		toDate: function(dateString) {
			if (!dateString){
				return new Date();
			}
			var rt;
			var arr = dateString.split(/\s+|\-|\:/);
			try {
				rt = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
			} catch (e) {
				rt = new Date();
			}
			
			return rt;
		},
		
		/**
		 * 对起始日期、终止日期进行基本校验
		 */
		checkDate: function(startDate, endDate) {
			if ((!startDate && endDate) || (startDate && ! endDate)) {
				if (!startDate) {
					alert("请填写起始日期!");
				} else {
					alert("请填写终止日期!");
				}
				return false;
			} else if (startDate && endDate) {
				if (new Date(endDate) < new Date(startDate)) {
					alert("终止日期不能小于起始日期!");
					return false;
				}
			}
			
			return true;
		}
	}; 
});