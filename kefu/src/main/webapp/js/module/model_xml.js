define(["module/service_xml","module/service_admin", "module/cfg", 
        "module/popup", "plugin/jquery.dataTables.min"], function(service,adminService, cfg, popup) {

	var conf = {
		info: {
			props: 	["id","name","path","uploadUserId"],
			header:	["ID", "名称","文件存放相对路径","上传用户ID"],
			op:		["编辑", "删除"],
			i18n: {
				"add": "增加"
			}
		}
	}
	
	return {
		init: function() {
			var ctx = EasyServiceClient.newContext();
			var admin=adminService.getCurrentAdmin();
			var data =null;
			if(admin.role==0)
				{
				  	data = service.findAll();
				}
			else
				{
					data = service.findAllByRole(admin.id);
				}
			ctx.data = data;
			ctx.props = conf.info.props;
			ctx.header = conf.info.header;
			ctx.op = conf.info.op;
			ctx.cls = "list";
			ejs.renderComplexNode("./tplt/xml/list.html", "#dynamicData", ctx);
			$('#summaryList').dataTable({
				"bJQueryUI": true,
				"sPaginationType": "full_numbers",
				"aoColumnDefs":[{
					"aTargets": [ 0,1 ], 
					"bSortable": false 
				}] ,							    
				"oLanguage": cfg.dataTableI18n										    
			});
			
			
			$("#bindDetailXml").bind("click", function(e) {
				var ele = e.target;
				if (ele.className == "detailXmlEdit" || ele.id == "createDetailXml") {
					var id = $(ele).attr("detailXmlId") ? $(ele).attr("detailXmlId") : "";
					popup.openWindow({
						url:		'./tplt/xml/editR.html?t=' + new Date().getTime() + "&id=" + id, 
						bgColor:	'#FFF', 
						width:		500,
						height:		400,
						title: 		!id ? "新建" : "修改"
					});
				} 
			});
			var thisObj = this;
			$(".detailXmlDel").bind("click", function(){
				var cfm = confirm("确定删除该记录吗?");
				if (cfm) {
					var id = $(this).attr("detailXmlId");
					if (!id) {
						throw new Error("can't delete data for null id! Error location: detailXml.init method.")
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