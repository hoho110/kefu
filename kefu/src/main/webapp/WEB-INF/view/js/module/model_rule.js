define(["module/service_rule", "module/cfg", 
        "module/popup", "plugin/jquery.dataTables.min"], function(service, cfg, popup) {

	var conf = {
		info: {
			props: 	["terminalType","imeiNum","regionNum","operation","apps"],
			header:	["序号", "机型", "imei","地区","客户端行为","推荐应用"],
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
			ejs.renderComplexNode("./tplt/rule/list.html", "#dynamicData", ctx);
			$('#summaryList').dataTable({
				"bJQueryUI": true,
				"sPaginationType": "full_numbers",
				"aoColumnDefs":[{
					"aTargets": [ 0,1 ], 
					"bSortable": false 
				}] ,							    
				"oLanguage": cfg.dataTableI18n										    
			});
			
			
			$("#bindDetailRule").bind("click", function(e) {
				var ele = e.target;
				if (ele.className == "detailRuleEdit" || ele.id == "createDetailRule") {
					var id = $(ele).attr("detailRuleId") ? $(ele).attr("detailRuleId") : "";
					popup.openWindow({
						url:		'./tplt/rule/editR.html?t=' + new Date().getTime() + "&id=" + id, 
						bgColor:	'#FFF', 
						width:		500,
						height:		400,
						title: 		!id ? "新建" : "修改"
					});
				} 
			});
			var thisObj = this;
			$(".detailRuleDel").bind("click", function(){
				var cfm = confirm("确定删除该记录吗?");
				if (cfm) {
					var id = $(this).attr("detailRuleId");
					if (!id) {
						throw new Error("can't delete data for null id! Error location: detailRule.init method.")
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