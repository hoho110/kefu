define(["module/service_install","module/service_app","module/service_admin", "module/cfg", 
        "module/popup", "plugin/jquery.dataTables.min","plugin/calendarR", "plugin/inputTips"], function(service,appService,adminService, cfg, popup) {

	var conf = {
		info: {
			props: 	["terminalType","appName","appPkgName","count"],
			header:	["序号","机型","应用名称", "应用PKGName","数量"],
		}
	}
	
	return {
		init: function() {
			var ctx = EasyServiceClient.newContext();
			var admin=adminService.getCurrentAdmin();
			if(admin.role==0)
			{
				ctx.apps = appService.findAll();
			}
			else
			{
				ctx.apps = adminService.findRefs(admin.id);
			}
			ctx.props = conf.info.props;
			ctx.header = conf.info.header;
			ctx.cls = "list";
			ejs.renderComplexNode("./tplt/install/query.html", "#dynamicData", ctx);
			var terminalType = null;
			var appPkgName = null;
			var start = -1;
			var end = -1;
			$("#statButton").bind("click", function(e) {
				ctx.data=service.count(terminalType,appPkgName,start,end)
				ejs.renderComplexNode("./tplt/install/list.html", "#detailQuery", ctx);
				$('#summaryList').dataTable({
					"bJQueryUI": true,
					"sPaginationType": "full_numbers",
					"aoColumnDefs":[{
						"aTargets": [ 0,1 ], 
						"bSortable": false 
					}] ,							    
					"oLanguage": cfg.dataTableI18n										    
				});
			});
			$("#terminalType").bind("change", function() {
				terminalType = $(this).val();
			});
			$("#appPkgName").bind("change", function() {
				var val = $(this).val();
				appPkgName = (val == "NONE_VALUE" ? null : val);
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
			$("#terminalType").bind("change", function() {
				terminalType = $(this).val();
			});
		}
	};
});