define(["module/util"],function(util){
	
	var dialogSelector;
	return{
		openDialogSimpleModalTop : function(htmlContent, width, height, title, resizable, beforeCloseCallBack) {

			var h = !height ? 600 : height;
			var w = !width ? 980 : width;
			h = (h <= 0) ? 600 : h;
			w = (w <= 0) ? 980 : w;
			var dialogId = util.uuidFast();
			dialogSelector = "#" + dialogId;
			$("#footer").after('<div id="' + dialogId + '" title="' + title + '"></div>');
			$(htmlContent).appendTo(dialogSelector);

			$(dialogSelector).dialog({
				minWidth : w,
				minHeight : h,
				modal : true,
				resizable : resizable,
				beforeClose : function(event, ui) {
					var close = true;
					if (beforeCloseCallBack) {
						close = beforeCloseCallBack(event, ui);
						if (close == undefined) {
							close = true;
						}
					}
					return close;
				}
			});
			//销毁组件
			$(dialogSelector).on("dialogclose", function(event, ui) {
				$(dialogSelector).dialog( "destroy" );
				$(dialogSelector).remove();
			});
		},
		close: function() {
			$(dialogSelector).trigger("dialogclose");
		}
	};
}
);