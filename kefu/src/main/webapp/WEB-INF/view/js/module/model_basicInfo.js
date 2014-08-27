define(["module/service_admin", "module/service_schema", "module/util",
        "module/service_sourceType", "module/service_language",
        "module/cfg", "module/popup", "plugin/jquery.dataTables.min"], 
        function(adminService, schemaService, util, sourceTypeService, langService, cfg, popup) {
	
	var conf = {
		schema: {
			props: 	["scName", "scNote", "scCode", "ill_itemtype", "schemaLevel", "parent.scName", "isSearch"],
			header:	["序号", "类型名称", "类型说明", "类型代码",  "馆际互借类型", "资源类型级别", "父类资源类型", "是否启用","操作"],
			op:	["编辑", "删除"],
			translator: {
				"true": "是",
				"false":"否" 
			}	
		},
		sourceType: {
			props: 	["sourceName", "code", "processClass"],
			header:	["序号", "文件类型", "代码", "处理类","操作"],
			op:	["编辑", "删除"]
		},
		lang: {
			props: 	["langName"],
			header:	["序号", "语种","操作"],
			op:	["编辑", "删除"]
		}
	};
	
	function initSchema() {
		try {
			var admin = adminService.getCurrentAdmin();
		} catch(e) {
			util.handleError(e);
		}
		var data;
		try {
			data = schemaService.findAll(); 
		} catch(e) {
			alert("获取数据文件信息失败!");
			return;
		}
		var ctx = EasyServiceClient.newContext();
		ctx.data = data;
		ctx.props = conf.schema.props;
		ctx.header =  conf.schema.header;
		ctx.op =  conf.schema.op;
		ctx.cls = "list";
		ctx.util = util;
		ctx.translator = conf.schema.translator;
		ejs.renderComplexNode("./tplt/schema/schema.htm", "#dynamicData", ctx);
		$('#dataSchemaList').dataTable(
				{
					"bJQueryUI": true,
					"sPaginationType": "full_numbers",
					"aoColumnDefs":[
				      {"aTargets": [ 0,1 ] , "bSortable": false }
				    ] ,							    
					"oLanguage": cfg.dataTableI18n										    
				} 			
		);
		$("#bindSchema").bind("click", $.proxy(function(e) {
			var ele = e.target;
			if (ele.className == "schemasEdit" || ele.id == "createSchemas" ) {
				var id = $(ele).attr("schemasId") ? $(ele).attr("schemasId") : "";
				popup.openWindow({
					url:		'./tplt/schema/editR.htm?t=' + new Date().getTime() + "&id=" + id, 
					bgColor:	'#FFF', 
					width:		400,
					height:		400,
					title: 		!id ? "新建" : "修改"
				});
			} else if (ele.className == "schemasDel") {
				var id = $(ele).attr("schemasDelId");
				var cfm = confirm("确定删除该记录吗?");
				if (cfm) {
					try {
						schemaService.delete(id);
						this.initSchema();
					} catch(e) {
						alert("与其他表有关联关系，不能轻易删除");
						return;
					}
				}
			}
		}, this));
	}
	
	function initSourceType() {
		try {
			var admin = adminService.getCurrentAdmin();
		} catch(e) {
			util.handleError(e);
		}
		var data;
		try {
			data = sourceTypeService.findAll(); 
		} catch(e) {
			alert("获取数据文件信息失败!");
			return;
		}
		var ctx = EasyServiceClient.newContext();
		ctx.data = data;
		ctx.props =  conf.sourceType.props;
		ctx.header = conf.sourceType.header;
		ctx.op = conf.sourceType.op;
		ctx.cls = "list";
		ejs.renderComplexNode("./tplt/sourceType/sourceType.htm", "#dynamicData", ctx);
		$('#datasourceTypeList').dataTable(
				{
					"bJQueryUI": true,
					"sPaginationType": "full_numbers",
					"aoColumnDefs":[
				    {"aTargets": [ 0,1 ] , "bSortable": false }
					] ,							    
					"oLanguage": cfg.dataTableI18n										    
				} 			
		);
		$("#bindSourceType").bind("click",  $.proxy(function(e) {
			var ele = e.target;
			if (ele.className == "sourceTypeEdit" || ele.id == "createSourceType" ) {
				var id = $(ele).attr("sourceTypeId") ? $(ele).attr("sourceTypeId") : "";
				popup.openWindow({
					url:		'./tplt/sourceType/editR.htm?t=' + new Date().getTime() + "&id=" + id, 
					bgColor:	'#FFF', 
					width:		400,
					height:		400,
					title: 		!id ? "新建" : "修改"
				});
			} else if (ele.className == "sourceTypeDel") {
				var id = $(ele).attr("sourceTypeDelId");
				var cfm = confirm("确定删除该记录吗?");
				if (cfm) {
					try {
						sourceTypeService.delete(id);
						this.initSourceType();
					} catch(e) {
						alert("与其他表有关联关系，不能轻易删除");
						return;
					}
				}
			}
		}, this));
	}
	
	function initLang() {
		try {
			var admin = adminService.getCurrentAdmin();
		} catch(e) {
			util.handleError(e);
		}
		var data;
		try {
			data = langService.findAll(); 
		} catch(e) {
			alert("获取数据文件信息失败!");
			return;
		}
		var ctx = EasyServiceClient.newContext();
		ctx.data = data;
		ctx.props = conf.lang.props;
		ctx.header = conf.lang.header;
		ctx.op = conf.lang.op;
		ctx.cls = "list";
		ejs.renderComplexNode("./tplt/language/language.htm", "#dynamicData", ctx);
		$('#dataLanguageList').dataTable(
				{
					"bJQueryUI": true,
					"sPaginationType": "full_numbers",
					"aoColumnDefs":[
				      {"aTargets": [ 0,1 ] , "bSortable": false }
				    ] ,							    
					"oLanguage": cfg.dataTableI18n										    
				} 			
		);
		$("#bindLanguage").bind("click", $.proxy(function(e) {
			var ele = e.target;
			if (ele.className == "languageEdit" || ele.id == "createLanguage" ) {
				var id = $(ele).attr("languageId") ? $(ele).attr("languageId") : "";
				popup.openWindow({
					url:		'./tplt/language/editR.htm?t=' + new Date().getTime() + "&id=" + id, 
					bgColor:	'#FFF', 
					width:		400,
					height:		400,
					title: 		!id ? "新建" : "修改"
				});
			} else if (ele.className == "languageDel") {
				var id = $(ele).attr("languageDelId");
				var cfm = confirm("确定删除该记录吗?");
				if (cfm) {
					try {
						langService.delete(id);
						this.initLang();
					} catch(e) {
						alert("与其他表有关联关系，不能轻易删除");
						return;
					}
				}
			}
		}, this));
	}
	
	return {
		initSchema: initSchema,
		initSourceType: initSourceType,
		initLang: initLang
	};
});