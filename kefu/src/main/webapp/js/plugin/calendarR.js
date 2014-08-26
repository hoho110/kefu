/**
 * jQuery日历插件
 * @author 		ZhengYanyi
 * @version		1.0.0
 * Copyright: 	CALIS
 * License: 	MIT
 * 
 *
 * API非常简单，与普通的jQuery插件调用相同，如"$(String selector).calendar(Objcet config);"
 * 
 * 其中，接口方法"calendar"唯一参数config为可选，JS对象类型，具有如下的可选属性(均为可选)：
 * showDetail, 	Boolean类型，是否显示时、分、秒等详细信息，默认为fasle
 * isFinalTime, Boolean类型，仅在日期不显示时分秒的情况下起作用，表示：是否是该天的最后时刻23:59:59秒，如果没有该参数默认为00:00:00
 * beginYear, 	日历控件"年"下拉框中的起始年，默认为2000年
 * endYear,		日历控件"年"下拉框中的终止年，默认2020
 * callback, 	回调函数，对应的日期输入框输入时间信息完毕后的处理
 * 
 * 
 * 调用示例：
 * -----HTML 代码-----
 * 普通日期：<input type="text" id="sDate" class="mydate" prop="startYear"/> 
 * 详细日期：<input type="text" id="eDate"  class="mydate prop="endYear"/> 
 * 
 * -----JavaScript代码-----
 * $(".mydate").calendar(); // 不显示时分秒
 * $(".mydate").calendar(showDetail:false); // 不显示时分秒
 * $(".mydate").calendar(showDetail:false, isFinalTime:true); // 不显示时分秒,isFinalTime参数只有在showDetail=false时起作用
 * $(".mydate").calendar({showDetail: true}); // 显示时分秒
 * 
 * 或者：
 * 
 * $("#sDate").calendar({showDetail: true}); // 显示时分秒
 * $("#eDate").calendar({showDetail: true});  
 * 
 * 或者：
 * 
 * //模型对象：假定当前的业务逻辑，要求日期填写完毕后，该对象值的属性进行相应更改
 * var model = {
 *		startYear: null, 
 * 		endYear: null
 * };
 * 	
 * // ...其他业务逻辑
 * 	
 * $("#sDate").calendar({
 * 		showDetail: true,
 * 		
 * 		//回调：选中日历后(文本框中已经具有了日期信息)的其他操作。
 * 		//参数说明如下：
 * 		//date，绑定日历的文本框中的当前日期，Date类型
 * 		//dateString，绑定日历的文本框中的当前日期，String类型 
 * 		//bindEle, 与该日历控件绑定的叶面元素，属原生DOM元素，Element类型 
 * 		callback: function(Date date, String dateString, Element bindEle) { 
 * 			model.startYear = date; // 文本框中日期输入完毕后，将模型对象的属性更改
 * 		},
 *		
 *		// 点击"清空"时的回调函数
 *		// 参数：bindEle，同上
 *		clearCallback: function(Element bindEle) {
 *			model[$(bindEle).attr("prop")] = null;
 *		}
 * })
 */
(function(factory){
	if (typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	} else {
		factory(jQuery);
	}
})(function($){
	var langI18n = {
		cn: {
			year: 			"年",
			month: 			["01月", "02月", "03月", "04月", "05月", "06月", "07月", "08月", "09月", "10月", "11月", "12月"],
			week: 			["一", "二", "三", "四", "五", "六", "七"],
			hour:			"时",
			minute:			"分",
			second:			"秒",
			clear:			"清除",
			today:			"今天",
			close:			"关闭",
			ok:				"确定",
			noSelection:	"请选择任一日期!",
			d2sPattern: {
				normal: 	"yyyy-MM-dd",
				detail: 	"yyyy-MM-dd hh:mm:ss"
			},
			s2dPattern: {
				normal: 	"yMd",
				detail: 	"yMdhms"
			}
		},
		
		en: {
			year: 			"",
			month: 			["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			week: 			["Sun", "Mon", "Tur", "Wed", "Thu", "Fri", "Sat"],
			hour:			"Hr",
			minute:			"Min",
			second:			"Sec",
			clear:			"Clear",
			today:			"Today",
			close:			"Close",
			ok:				"OK",
			noSelection:	"Please make one day selected!",
			d2sPattern: {
				normal: 	"yyyy-MM-dd",
				detail: 	"yyyy-MM-dd hh:mm:ss"
			},
			s2dPattern: {
				normal: 	"yMd",
				detail: 	"yMdhms"
			}
		}
	};
	
	var print = ((window.console && window.console.log) ? window.console.log : (function(){})), // 封装打印功能
		isDocBind = false;
	
	
	/**
	 * 将Date类型转化为字符串。
	 * 供Date类型调用，如:parse2String.call(new Date(), "yyyy-MM-dd hh:mm:ss")
	 * @param datePattern
	 */
	function parse2String(datePattern) {
		var o = {
			"M+" : this.getMonth() + 1, //month
			"d+" : this.getDate(),      //day
			"h+" : this.getHours(),     //hour
			"m+" : this.getMinutes(),   //minute
			"s+" : this.getSeconds(),   //second
			"w+" : "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".charAt(this.getDay()),   //week
			"q+" : Math.floor((this.getMonth() + 3) / 3),  //quarter
			"S"  : this.getMilliseconds() //millisecond
		};
		if (/(y+)/.test(datePattern)) {
			datePattern = datePattern.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("("+ k +")").test(datePattern)) {
				datePattern = datePattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		
		return datePattern;
	}
	 
	/**
	 * 将时间字符串转换为日期类型
	 * 供String类型调用，如：parse2Date.call("2013-12-31", "-", "yMdhms")
	 */
	function parse2Date(delimiter, pattern) {
		delimiter = delimiter || "-";
		delimiter = new RegExp("\\s+|\\" + delimiter + "|\\:"); // 假定时分秒按:分隔，拼写成正则：/\s+|\-|\:/
		pattern = pattern || "yMdhms";
		
		var a = this.split(delimiter);
		var y = parseInt(a[pattern.indexOf("y")], 10);
		if (y.toString().length <= 2) {
			y += 2000;
		}
		if(isNaN(y)) {
			y = new Date().getFullYear();
		}
		var m = parseInt(a[pattern.indexOf("M")], 10) - 1;
		var d = parseInt(a[pattern.indexOf("d")], 10);
		if(isNaN(d)) {
			d = 1;
		}
		
		var isDetailFormat = pattern.length > 3;
		if (isDetailFormat) {
			var hour = parseInt(a[pattern.indexOf("h")], 10),
				minute = parseInt(a[pattern.indexOf("m")], 10),
				second =  parseInt(a[pattern.indexOf("s")], 10);
			if (isNaN(hour)) {
				hour = 0;
			}
			if (isNaN(minute)) {
				minute = 0;
			}
			if (isNaN(second)) {
				second = 0;
			}
			return new Date(y, m, d, hour, minute, second);
		} else {
			return new Date(y, m, d);
		}	
	}
	
	/**
	 * 根据年、月初始化各个日
	 * @param y
	 * @param m
	 * @returns {Array}
	 */
	function getMonthViewDateArray(y, m) {
		var dateArray = new Array(42);
		var dayOfFirstDate = new Date(y, m, 1).getDay();
		var dateCountOfMonth = new Date(y, m + 1, 0).getDate();
		for (var i = 0; i < dateCountOfMonth; i++) {
			dateArray[i + dayOfFirstDate] = i + 1;
		}
		return dateArray;
	}
	
	/**
	 * 获取DOM元素的位置
	 */
	function getAbsPoint(element){
		var x = element.offsetLeft;
		var y = element.offsetTop;
		while(element = element.offsetParent){
			x += element.offsetLeft;
			y += element.offsetTop;
		}
		
		return {"x": x, "y": y};
	}
	
	// 初始化日历面板
	function createPanel() {
		if ($("#__calendarPanel").length == 0) {
			var divStr = '<div id="__calendarPanel" class="__calendar"></div>';
			var jqDiv = $(divStr);
			$(document.body).append(jqDiv);
		}
	}
	
	function Calendar(conf) {
		// 初始化日历参数
		this.dateControl = conf.control;
		this.callback = conf.callback || null; 
		this.clearCallback = conf.clearCallback || null;
		this.showDetail = conf.showDetail || false;
		if (!this.showDetail) {
			// 不显示时分秒时，默认时间：所选的日期年月日，时分秒均为0；如果isFinalTime为true，则对应23时59分59秒
			this.isFinalTime = conf.isFinalTime || false; 
		}
		this.beginYear = conf.beginYear || 2010;
		this.endYear   = conf.endYear   || 2030;
		this.language  = conf.language  || "cn";
		this.delimiter = conf.delimiter || "-";
		
		var timeType = this.showDetail ? "detail" : "normal",
				timeStr = $.trim(this.dateControl.value);
		this.date2StringPattern = conf.d2sPattern || langI18n[this.language]["d2sPattern"][timeType].replace(/\-/g, this.delimiter);
		this.string2DatePattern = conf.s2dPattern || langI18n[this.language]["s2dPattern"][timeType];
		if (timeStr.length > 0) {
			this.date = parse2Date.apply(timeStr, [this.delimiter, this.string2DatePattern]);
		} else {
			// 初始化当前日期时间
			this.date = new Date();
		}
		
		createPanel();
		this.panel = $("#__calendarPanel");
		this.form  = null;
	};
	
	/**
	 * 创建时、分、秒的option字符串，放入Ojbect中
	 * @returns Object类型，包括5个属性: "year", "month", "hour", "minute", "second"，分别代表年、月、时、分、秒的option串
	 */
	Calendar.prototype.createTimeUnit = function() {
		var now = this.date,
			timeMap = {};
		
		var timeInfo = [{
				name: "hour",
				cnt: 24,
				current: now.getHours(),
				start:0
			}, {
				name: "minute",
				cnt: 60, 
				current: now.getMinutes(),
				start:0
			}, {
				name: "second",
				cnt: 60,
				current: now.getSeconds(),
				start:0
			}, {
				name: "year",
				cnt: this.endYear - this.beginYear + 1,
				current: now.getFullYear(),
				start: this.beginYear,
				i18n: langI18n[this.language]["year"]
			}, {
				name: "month",
				cnt: 12,
				current: now.getMonth(),
				start:0,
				i18n: langI18n[this.language]["month"]
			}
		];
		
		for (var j = 0, jl = timeInfo.length; j < jl; j++) {
			var unit = timeInfo[j], options = "";
			for (var i = unit.start, l = unit.start + unit.cnt; i < l; i++) {
				var value, name;
				if (unit.name != "month") {
					value = (i < 10 ? "0" + i : i);
				} else {
					value = i;
				}
				if (unit.i18n) {
					if (unit.name == "year") {
						name = i + langI18n[this.language][unit.name];
					} else if  (unit.name == "month") {
						name = langI18n[this.language][unit.name][i];
					}
					
				} else {
					name = value;
				}
				options += "<option value='" + value + "'" + (i == unit.current ? " selected" : "") + ">" + name + "</option>"; 
			}
			timeMap[unit.name] = options;
		}
		
		
		return timeMap;
	};
	
	// 画出日历表格，但此时里面没有具体的日数据(42个存放"天"的td为空)
	Calendar.prototype.draw = function() {
		// 先根据是否有时分秒，初始化panel(有时分秒时，为显得美观，日历稍大一些)
		if (!this.showDetail) {
			$("#__calendarPanel").css({
				height: "203px", // 按火狐浏览器计算：中间7个tr，最上、最下2个tr度分别25和24，底边余量(7像素)的累加：21*7 + 25 + 24 + 7
				width: "186px"
			});
		} else {
			$("#__calendarPanel").css({
				height: "226px", // 较上面情况多1个高度为25的tr：存放时、分、秒
				width: "200px"
			});
		}
		
		var calendar = this;
		var _cs = [];
		var timeUnits = calendar.createTimeUnit();
		
		// 初始化，首行的按钮、下拉框等
		var table = 
		'<form id="__calendarForm" name="__calendarForm" method="post">' +
			'<table id="__calendarTable">' +
			'<tr class="ymContainer">' + 
				'<th>' + 
					'<input class="previous" name="goPrevMonthButton" type="button" id="goPrevMonthButton" value="&lt;" \/>' + 
				'<\/th>' +
				'<th colspan="5">' + 
					'<select class="year" name="yearSelect" id="yearSelect">' + timeUnits["year"] + '<\/select>' + 
					'<select class="month" name="monthSelect" id="monthSelect">' + timeUnits["month"] + '<\/select>' + 
				'<\/th>' +
				'<th>' + 
					'<input class="next" name="goNextMonthButton" type="button" id="goNextMonthButton" value="&gt;" \/>' +
				'<\/th>' +
			'<\/tr>' +
			'<tr class="theader">';
		
		// 日历标题：日、一、二...七
		for(var i = 0; i < 7; i++) {
			table += '<th>' + langI18n[this.language]["week"][i] + '<\/th>';
		}
		table += '<\/tr>';
		
		// 日历天对应的td
		for(var i = 0; i < 6; i++){
			table += '<tr>';
			for(var j = 0; j < 7; j++) {
				switch (j) {
					case 0: table += '<td class="sun">&nbsp;<\/td>'; break;
					case 6: table += '<td class="sat">&nbsp;<\/td>'; break;
					default: table += '<td class="normal">&nbsp;<\/td>'; break;
				}
			}
			table += '<\/tr>';
		}
		
		// 如果需要显示详细时间（时、分、秒），则添加本行数据
		if (calendar.showDetail) {
			table += 
				'<tr class="hmsContainer">' + 
					'<th colspan="7">' + 
						langI18n[this.language]["hour"] + ':' +	'<select class="hour" prop="hour" name="hourSelect">' + timeUnits["hour"] + '</select>' + 
						langI18n[this.language]["minute"] + ':' + '<select class="hour" prop="minute" name="minuteSelect">' + timeUnits["minute"] + '</select>' + 
						langI18n[this.language]["second"] + ':' + '<select class="hour" prop="second" name="secondSelect">' + timeUnits["second"] + '</select>' + 
					'</th>' +
				'</tr>';
		}
		
		// 末行的操作按钮：清空、今天、关闭等
		var lastLine = "", lastControl;
		// 如果显示时分秒，最后一行的最后一个按钮为"关闭"
		if (calendar.showDetail) {
			lastControl = '<input type="button" class="cmd" name="closeButton" id="closeButton" \/>';
		
		// 否则，最后一个按钮为"今天"
		} else {
			lastControl = '<input type="button" class="cmd" name="selectTodayButton" id="selectTodayButton" \/>';
		}
		lastLine = 	
				'<tr class="tfooter">' +
					'<th colspan="7">' + 
						'<input type="button" class="cmd" name="clearButton" id="clearButton" \/>' + 
						lastControl + 
					'<\/th>' +
				'<\/tr>' +
			'<\/table>' +
		'<\/form>';
		table += lastLine;
		_cs.push(table);
		
		this.panel.html(_cs.join(""));
		this.form = $("form", this.panel[0])[0];
		if (calendar.showDetail) {
			this.form.closeButton.value = langI18n[this.language]["ok"];
		} else {
			this.form.selectTodayButton.value = langI18n[this.language]["today"];
		}
		this.form.clearButton.value = langI18n[this.language]["clear"];
		
		this.bindButton();
		
	};
	
	/**
	 * 根据当前的年、月重新渲染年、月下拉框
	 */
	Calendar.prototype.renewYearAndMonth = function() {
		var ys = this.form.yearSelect;
		var ms = this.form.monthSelect;
		for (var i= 0; i < ys.length; i++){
			if (ys.options[i].value == this.date.getFullYear()){
				ys[i].selected = true;
				break;
			}
		}
		for (var i= 0; i < ms.length; i++){
			if (ms.options[i].value == this.date.getMonth()){
				ms[i].selected = true;
				break;
			}
		}
	};
	
	/**
	 * 多个button、select的事件绑定
	 */
	Calendar.prototype.bindButton = function() {
		$(this.form).delegate("select", "change", $.proxy(function(e) {
			var jqSel = $(e.target),
				name = jqSel.attr("name");
			
			if (name == "yearSelect") {
				this.date.setFullYear(jqSel.val());
				this.renewDaysInMonth(false);
			} else if (name == "monthSelect") {
				this.date.setMonth(jqSel.val());
				this.renewDaysInMonth(false);
			} else {
				({
					"hour": this.date.setHours,
					"minute": this.date.setMinutes,
					"second": this.date.setSeconds
				})[jqSel.attr("prop")].call(this.date, parseInt(jqSel.val()));
				
				/* ---上面代码的等效代码，效率孰高孰低?---
				if (this.showDetail) {
					var val = jqSel.val();
					switch (jqSel.attr("prop")) {
						case "hour": this.date.setHours(val);
						case "minute": this.date.setMinutes(val);
						case "second": this.date.setSeconds(val);
						default: break;
					}
				}
				*/
			}
		}, this));
		
		$(this.form).bind("click", $.proxy(function(e) {
			e.stopPropagation();
			
			var jqTarget = $(e.target),
				name = jqTarget.attr("name");
			
			if (name == "goPrevMonthButton") {
				var year = this.date.getFullYear(),
					month = this.date.getMonth();
				if (year == this.beginYear && month == 0){return;}
				month--;
				if (month == -1) {
					year--;
					month = 11;
				}
				this.date = new Date(year, month, 1, this.date.getHours(), this.date.getMinutes(), this.date.getSeconds());
				this.renewYearAndMonth();
				this.renewDaysInMonth(false);
			} else if (name == "goNextMonthButton") {
				var year = this.date.getFullYear(),
					month = this.date.getMonth();
				if (year == this.endYear && month == 11){return;}
				month++;
				if (month == 12) {
					year++;
					month = 0;
				}
				this.date = new Date(year, month, 1, this.date.getHours(), this.date.getMinutes(), this.date.getSeconds());
				this.renewYearAndMonth();
				this.renewDaysInMonth(false);
			} else if (name == "clearButton") {
				this.dateControl.value = "";
				if (this.clearCallback) {
					this.clearCallback(this.dateControl);
				}
			} else if (name == "closeButton") {
				// 正常情况下，只有出现时分秒时，才出现关闭按钮
				if (this.showDetail) {
					if ($("td.curDay", this.panel[0]).length == 0) {
						e.stopPropagation();
						alert(langI18n[this.language].noSelection);
						return;
					}
					this.output();
					this.hide();
				}
			} else if (name == "selectTodayButton") {
				this.date = new Date();
				this.output();
				this.hide();
			}  
		}, this));
		
		// 页面点击后隐藏日历控件
		if (!isDocBind) {
			$(document).bind("click", $.proxy(function(e){
				this.hide();
			}, this));
			isDocBind = true;
		}
	};
	
	// 将当前的日期输出到对应的文本框控件
	Calendar.prototype.output = function() {
		var dateStr = this.getDateString();
		$(this.dateControl).val(dateStr); 
		if (this.callback) {
			this.callback(this.date, dateStr, this.dateControl);
		}
	};
	
	// 获取当前日期的文本串
	Calendar.prototype.getDateString = function() {
		var date = this.date;
			y = date.getFullYear(),
			M = date.getMonth(),
			d = date.getDate(),
			h = date.getHours(),
			m = date.getMinutes(),
			s = date.getSeconds();
			
//		var curDate = this.showDetail ? new Date(y, M, d, h, m, s) : new Date(y, M, d);
		
		if (this.showDetail) {
			return parse2String.call(this.date, this.date2StringPattern);
		} else {
			if (this.isFinalTime) {
				this.date = new Date(y, M, d, 23, 59, 59);
			} else {
				this.date = new Date(y, M, d);
			}
			return parse2String.call(this.date, this.date2StringPattern);
		}
	};
	
	// 根据选定的日期，出现对应的日历样式
	Calendar.prototype.renewDaysInMonth = function (showCurDay) {
		var dateArray = getMonthViewDateArray(this.date.getFullYear(), this.date.getMonth()),
			allTds = $("td", this.panel[0]),
			selectedTd; // 保存当前选中的td元素

		// 去除之前选中的天样式、鼠标滑移样式
		allTds.filter("td.curDay").removeClass("curDay"); 
		allTds.unbind("mouseover");
		allTds.unbind("mouseout");
		
		allTds.each($.proxy(function(idx, td) {
			var jqCell = $(td);
			if (idx > dateArray.length - 1) return; //TODO:validate
			if (dateArray[idx]) {
				jqCell.html(dateArray[idx]);
				jqCell.addClass("realday");
				
				var y = this.date.getFullYear(), m = this.date.getMonth(), d = this.date.getDate(),
					selY = $("#yearSelect", this.panel[0]).val(),
					selM = $("#monthSelect", this.panel[0]).val();
				if (selY == y && selM == m && dateArray[idx] == d && showCurDay) {
					jqCell.addClass("curDay");
					selectedTd = jqCell;
				}
			} else {
				jqCell.html("&nbsp;");
				jqCell.removeClass("realday");
			}
		}, this));
		
		$("#__calendarTable", this.panel[0]).delegate("td.realday", "click", $.proxy(function(e){
			var newSelTd = $(e.target),	// 点击后最新选中的td元素 
				dayNum = newSelTd.html();
			
			// 设定选中样式，并将原有的选中元素的选中样式去除
			newSelTd.removeClass("msover");
			newSelTd.addClass("curDay");
			if (selectedTd && dayNum != selectedTd.html()) {
				selectedTd.removeClass("curDay");
				selectedTd = newSelTd;	// 保存当前选中的td元素
			}
			this.date.setDate(dayNum);
			
			if (!this.showDetail) {
				this.output();
				this.hide();
			}
			e.stopPropagation();
		}, this));
		
		$("#__calendarTable td.realday", this.panel[0]).bind("mouseover", function(e){
			$(this).addClass("msover");
		});
		
		$("#__calendarTable td.realday", this.panel[0]).bind("mouseout", function(e){
			$(this).removeClass("msover");
		});
	};
	
	// 显示日历
	Calendar.prototype.show = function () {
		this.draw();
		this.renewDaysInMonth(true);
		
		var position = getAbsPoint(this.dateControl);		
		$(this.panel).css({
			left: position.x + "px",
			top: (position.y + this.dateControl.offsetHeight) + "px",
			visibility: "visible"
		});
	};
	
	// 隐藏日历
	Calendar.prototype.hide = function() {
		$(this.panel).css({visibility: "hidden"});
//		$(this.panel).remove(); // why not appliable?
	};
	
	// jQuery插件接口
	$.fn.calendar = function(config) {
		this.each(function(idx, ele){
			$(ele).bind("click",  function(e){
				var cal = new Calendar($.extend(config,{control: this}));
				cal.show();
				e.stopPropagation();
			});
		});
	};
});