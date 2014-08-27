require.config({
	baseUrl : "./js",
	paths : {
		cal : "plugin/calendar",
		jquery: "lib/jquery-1.7.1"
	},
	waitSeconds : 10
});
require(["jquery", "module/util", 
         "module/service_admin", "module/model_admin", "module/cfg"], function($, util, adminService, modAdmin, cfg) {
	var isLogin = modAdmin.isLogin();
	if(!isLogin){
	   window.location = "login.html";
	   return;
	}
	
	var ele2Listener = cfg.ele2Listener;
	$(function(){	
		var ctx = EasyServiceClient.newContext();
		try {
			// 注意：前端对adminService.getCurrentAdmin进行了包装，进行了缓存处理
			var loginAdmin = adminService.getCurrentAdmin(); 
		} catch(e) {
			alert("获取管理员信息失败，页面不能正常显示!");
			throw new Error("Get admin failure!");
		}
		ctx.curAdmin = loginAdmin;
		//ctx.privilege = loginAdmin.privilege;
		//ctx.type = loginAdmin.nodeInfo.type;
		ejs.renderComplexNode("#pageTmpl", "#pageContent", ctx);
		
		
		$(".menu_list p.menu_head").click(function(){
			$(this).children(".menu_ico").css({backgroundImage:"url(./img/menu_img/ico_o.jpg)"});
			$(this).next("div.menu_body:first").slideToggle(400);
	       	//$(this).siblings().children(".menu_ico").css({backgroundImage:"url(./img/menu_img/ico_c.jpg)"});
		});
		$("#logoutLink").bind("click", function(e) {
			logout(loginAdmin);
			e.stopPropagation();
		});
		
		util.adjustWidthOfDataArea();
		util.compareScrResolution();
		
		// 事件代理，处理各个菜单的点击动作
		$("#navDiv").bind("click", function(e){
			var id = e.target.id;
			if (!ele2Listener[id]) {
				return;
			}
			initSubMenu(id);
			// 阻止默认行为和事件传播
			e.preventDefault();
		});
		
		// 事件代理，监听各个锚点、button等的点击
		$(document).bind("click", function(e){
			var element = e.target,
				jqEle = $(element),
				targetElements = "a, button, input[type=button], input[type=image]";
			
			if (jqEle.is(targetElements)) {
				try {
					var currentUser = adminService.getCurrentAdmin(); // 前端getUser方法对应后台的getCurrentAdmin方法
				} catch (e) {
					var t = e._t_;
					// 如果是超时，直接对到对应的登录界面
					if (!t || $.trim(e._t_) == "com.cnebula.kefu.service.ass.SessionTimeOutException") {
						alert("您的会话已经过期!")
						window.location.href = "login.html";
					} 
				}
			}
		});
	});
	
	//第二个参数：仅供弹出子窗口调用
	function initSubMenu(menuId, subWinPara) {
		var listenerConf = ele2Listener[menuId];
		if (!listenerConf) {
			return;
		}
		require([listenerConf.moduleName], function(module) {
			if(typeof subWinPara != "undefined") {
				module[listenerConf.method](subWinPara);
			} else {
				if (listenerConf.args) {
					module[listenerConf.method](listenerConf.args);
				} else {
					module[listenerConf.method]();
				}
			}
		});
	}
	
	// 根据用户类型，退出系统
	function logout(admin) {
		try {
			adminService.logout();
		} catch (e) {
			var t = e._t_;
			// 如果是超时，直接对到对应的登录界面
			if (t && $.trim(t) != "com.cnebula.kefu.service.ass.SessionTimeOutException") {
				util.console.error("failure when IAdministratorService.logout is called.");
			}
		}
		window.location.href = "login.html";
	}
	
	//定义全局函数，供弹出窗口调用
	window.initSubMenu = initSubMenu; 
});