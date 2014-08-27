define(["module/service_register", "module/cfg", 
        "module/popup", "plugin/jquery.dataTables.min","plugin/calendarR", "plugin/inputTips"], function(service, cfg, popup) {
	
	return {
		init: function() {
			var ctx = EasyServiceClient.newContext();
			ejs.renderComplexNode("./tplt/register/query.html", "#dynamicData", ctx);
			var start = -1;
			var end = -1;
			$("#statButton").bind("click", function(e) {
				ctx.data=service.count(start,end)
				ejs.renderComplexNode("./tplt/register/result.html", "#detailQuery", ctx);
			});
			// 日历文本框
			$(".timeRange").calendar({
				showDetail:true,
				callback: function(date, dateString, ele) {
					var prop=$(ele).attr("prop");
					if(prop=='from')
					{
						start=(date==null?-1:date.getTime());
					}
					else
					{
						end=(date==null?-1:date.getTime());
					}
				},
				clearCallback: function(ele) {
					var prop=$(ele).attr("prop");
					if(prop=='from')
					{
						start=-1;
					}
					else
					{
						end=-1;
					}
				}
			});
		}
	};
});