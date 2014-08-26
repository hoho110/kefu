define(["module/service_district", "module/cfg", 
        "module/popup", "plugin/jquery.dataTables.min"], function(service, cfg, popup) {

	var conf = {
		info: {
			props: 	["name","code"],
			header:	["序号","名称", "代码"],
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
			ejs.renderComplexNode("./tplt/district/list.html", "#dynamicData", ctx);
			$('#summaryList').dataTable({
				"bJQueryUI": true,
				"sPaginationType": "full_numbers",
				"aoColumnDefs":[{
					"aTargets": [ 0,1 ], 
					"bSortable": false 
				}] ,							    
				"oLanguage": cfg.dataTableI18n										    
			});
			
			
			$("#bindDetailDistrict").bind("click", function(e) {
			});
			var thisObj = this;
			$(".detailDistrictDel").bind("click", function(){
			});
		}
	};
});