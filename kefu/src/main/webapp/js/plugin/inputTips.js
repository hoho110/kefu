/**
 * jquery插件：用于向文本框加入默认提示，如搜索框的"请输入关键词"。
 * 鼠标左键点击后，默认的提示消失
 * 如果用户未输入内容，焦点离开文本框后，继续出现默认的提示信息。
 * 
 * 接口调用示例:$("#yourInputId").inputTips("请输入关键词");
 * @param words, String类型， 提示信息文本串
 * @author zhengyy
 * @version 1.0.0
 */
(function(factory){
	if (typeof define === "function" && define.amd) {
		define(["jquery"], factory)
	} else {
		factory($);
	}
})(function($){
	$.fn.inputTips = function(words) {
		var control = $(this),
			clz = "greyWord";
		
		control.bind("click", function(e){
			var val = $.trim(control.val());
			if (val == words) {
				control.val("");
				control.removeClass(clz)
			}
		});
		
		control.bind("blur", function(e){
			var val = $.trim($(this).val());
			if (val.length == 0) {
				fillWords();
			}
		});
		
		function fillWords() {
			control.val(words);
			control.addClass(clz);
		}
		
		fillWords();
	};
});