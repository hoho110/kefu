define(["module/service_app", "module/cfg", 
        "module/popup", "plugin/jquery.dataTables.min"], function(service, cfg, popup) {

	var conf = {
		info: {
			props: 	["id","name","pkgName","installName","path","message"],
			header:	["ID", "应用名称","pkgName", "安装包名","安装包存放相对路径","信息"],
			op:		["编辑", "删除"],
			i18n: {
				"add": "增加"
			}
		}
	}
	
	return {
		init: function() {
			var data = service.findAll();
			var ctx = EasyServiceClient.newContext();
			ctx.data = data;
			ctx.props = conf.info.props;
			ctx.header = conf.info.header;
			ctx.op = conf.info.op;
			ctx.cls = "list";
			ejs.renderComplexNode("./tplt/app/list.html", "#dynamicData", ctx);
			$('#summaryList').dataTable({
				"bJQueryUI": true,
				"sPaginationType": "full_numbers",
				"aoColumnDefs":[{
					"aTargets": [ 0,1 ], 
					"bSortable": false 
				}] ,							    
				"oLanguage": cfg.dataTableI18n										    
			});
			
			
			$("#bindDetailApp").bind("click", function(e) {
				var ele = e.target;
				if (ele.className == "detailAppEdit" || ele.id == "createDetailApp") {
					var id = $(ele).attr("detailAppId") ? $(ele).attr("detailAppId") : "";
					popup.openWindow({
						url:		'./tplt/app/editR.html?t=' + new Date().getTime() + "&id=" + id, 
						bgColor:	'#FFF', 
						width:		500,
						height:		400,
						title: 		!id ? "新建" : "修改"
					});
				} 
			});
			var thisObj = this;
			$(".detailAppDel").bind("click", function(){
				var cfm = confirm("确定删除该记录吗?");
				if (cfm) {
					var id = $(this).attr("detailAppId");
					if (!id) {
						throw new Error("can't delete data for null id! Error location: detailApp.init method.")
					}
					try {
						service["deleteInfo"](parseInt(id));
					} catch (e) {
						alert("删除出错!");
						return;
					}
					thisObj.init();
				}
			});
		}
	};
});