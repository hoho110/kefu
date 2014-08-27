define(function() {
	return {
		dataTableI18n : {
			"sLengthMenu" : "每页显示 _MENU_条",
			"sZeroRecords" : "没有找到符合条件的数据",
			"sProcessing" : "加载中...",
			"sInfo" : "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
			"sInfoEmpty" : "没有记录",
			"sInfoFiltered" : "(从 _MAX_ 条记录中过滤)",
			"sSearch" : "搜索：",
			"oPaginate" : {
				"sFirst" : "首页",
				"sPrevious" : "前一页",
				"sNext" : "后一页",
				"sLast" : "尾页"
			}
		},
		logoutUrl : {
			1 : "admin.html", // 平台管理员
			0 : "admin.html", // 普通成员馆管理员
			2 : "admin.html" // CALIS管理员
		},
		ele2Listener : {
			// 基础信息管理
			"ruleMenu" : { //页面元素ID， 下同
				moduleName : "module/model_rule",
				method : "init"
			},
			"districtMenu" : {
				moduleName : "module/model_district",
				method : "init"
			},
			"appMenu" : {
				moduleName : "module/model_app",
				method : "init"
			},
			"installMenu" : {
				moduleName : "module/model_install",
				method : "init"
			},
			"registerMenu" : {
				moduleName : "module/model_register",
				method : "init"
			},
			"passMenu": {
				moduleName: "module/model_admin",
				method: "updatePassword"
			},
			"appUserMenu": {
				moduleName: "module/model_admin",
				method: "initAppUser"
			},
			"vendorUserMenu": {
				moduleName: "module/model_admin",
				method: "initVendorUser"
			},
			"xmlMenu" : {
				moduleName : "module/model_xml",
				method : "init"
			}
		}
	};
})
