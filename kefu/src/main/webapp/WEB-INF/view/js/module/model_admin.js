/**
 * 
 */
define(["module/service_admin", "module/cfg","module/popup", "module/util", "jquery", "plugin/jquery.dataTables.min"], function(adminService,cfg,popup, util, $) {
	var conf = {
			info: {
				props: 	["userName"],
				header:	["序号", "用户名"],
				op:		["编辑", "删除"],
				i18n: {
					"add": "增加"
				}
			}
	}
	return {
		initAppUser:function()
		{
			var data = adminService.findAll(1);
			var ctx = EasyServiceClient.newContext();
			ctx.data = data;
			ctx.props = conf.info.props;
			ctx.header = conf.info.header;
			ctx.op = conf.info.op;
			ctx.cls = "list";
			ctx.role=1;
			ejs.renderComplexNode("./tplt/admin/list.html", "#dynamicData", ctx);
			$('#summaryList').dataTable({
				"bJQueryUI": true,
				"sPaginationType": "full_numbers",
				"aoColumnDefs":[{
					"aTargets": [ 0,1 ], 
					"bSortable": false 
				}] ,							    
				"oLanguage": cfg.dataTableI18n										    
			});
			$("#bindDetailAdmin").bind("click", function(e) {
				var ele = e.target;
				if (ele.className == "detailAdminEdit" || ele.id == "createDetailAdmin") {
					var id = $(ele).attr("detailAdminId") ? $(ele).attr("detailAdminId") : "";
					popup.openWindow({
						url:		'./tplt/admin/editR.html?t=' + new Date().getTime() + "&id=" + id+"&role=1", 
						bgColor:	'#FFF', 
						width:		500,
						height:		400,
						title: 		!id ? "新建" : "修改"
					});
				} 
			});
			var thisObj = this;
			$(".detailAdminDel").bind("click", function(){
				var cfm = confirm("确定删除该记录吗?");
				if (cfm) {
					var id = $(this).attr("detailAdminId");
					if (!id) {
						throw new Error("can't delete data for null id! Error location: detailAdmin.init method.")
					}
					try {
						adminService.deleteInfo(parseInt(id));
					} catch (e) {
						alert("删除出错!");
						return;
					}
					thisObj.initAppUser();
				}
			});
		},
		initVendorUser:function()
		{
			var data = adminService.findAll(2);
			var ctx = EasyServiceClient.newContext();
			ctx.data = data;
			ctx.props = conf.info.props;
			ctx.header = conf.info.header;
			ctx.op = conf.info.op;
			ctx.cls = "list";
			ctx.role=2;
			ejs.renderComplexNode("./tplt/admin/list.html", "#dynamicData", ctx);
			$('#summaryList').dataTable({
				"bJQueryUI": true,
				"sPaginationType": "full_numbers",
				"aoColumnDefs":[{
					"aTargets": [ 0,1 ], 
					"bSortable": false 
				}] ,							    
				"oLanguage": cfg.dataTableI18n										    
			});
			$("#bindDetailAdmin").bind("click", function(e) {
				var ele = e.target;
				if (ele.className == "detailAdminEdit" || ele.id == "createDetailAdmin") {
					var id = $(ele).attr("detailAdminId") ? $(ele).attr("detailAdminId") : "";
					popup.openWindow({
						url:		'./tplt/admin/editR.html?t=' + new Date().getTime() + "&id=" + id+"&role=2", 
						bgColor:	'#FFF', 
						width:		500,
						height:		400,
						title: 		!id ? "新建" : "修改"
					});
				} 
			});
			var thisObj = this;
			$(".detailAdminDel").bind("click", function(){
				var cfm = confirm("确定删除该记录吗?");
				if (cfm) {
					var id = $(this).attr("detailAdminId");
					if (!id) {
						throw new Error("can't delete data for null id! Error location: detailAdmin.init method.")
					}
					try {
						adminService.deleteInfo(parseInt(id));
					} catch (e) {
						alert("删除出错!");
						return;
					}
					thisObj.initVendorUser();
				}
			});
		},
	
		/**
		 * 用于登录使用
		 */
		yiduLogin : function (){
			var userInput = document.getElementById("userName");
			var pwdInput = document.getElementById("password");
			try{
				var user = adminService.loginByNamePassword(userInput.value, pwdInput.value);
				window.location = "admin.html";
			}catch(e){
				try {
					util.console.log("Exception info:" + (e.message || e._t_ || e));
				} catch(e) {}
				if(document.getElementById("userName").value == "") {
					document.getElementById("tip").innerHTML="用户名不能为空!";
					return;
				} else {
					document.getElementById("tip").innerHTML="用户名或者密码错误！";
					return;
				}
			}
		},
		/*跳到登录页面*/
		toLogin : function(){
			alert("会话可能超时，请重新登录!");
			window.location="/educhina/uas";
		},
		/*判断是否登录*/
		isLogin : function(){
			return adminService.isLogin();
		},
		/*判断是否登录，如果未登录则跳到登录页面*/
		checkLogin : function(){
			var isLogin = this.isLogin();
			if(!isLogin){
				this.toLogin();
				return;
			}
		},
		/*logout : function(){
			adminService.logout();
			window.location = "login.html";
		},*/
		updatePassword : function() {
			ejs.renderComplexNode("./tplt/admin/UpdatePwd.html", "#dynamicData");
			$("#savepwd").bind("click", $.proxy(function(){
				this.checkNewPwd2();
			}, this));
		},
		checkOldPwd : function (userId,pwd){
			var admin=adminService.getCurrentAdmin();
			var oldpwd = (admin)?admin.passWord:"";
			var _oldpwd = document.getElementById("oldpwd").value;
			if(oldpwd!=_oldpwd){
				document.getElementById("oldpwdmsg").innerHTML="<font color='red'>原始密码错误!</font>";
				return;
			}else{
				var msg ="";
				document.getElementById("oldpwdmsg").innerHTML="";
				try{
					msg =adminService.updatePassword(admin.id,pwd);
				}catch(e){
					alert("修改密码时出错!");
					return;
				}
				alert(msg);	
				document.getElementById("oldpwd").value="";
				document.getElementById("newpwd").value="";
				document.getElementById("newpwd2").value="";
			}
		},
		
		checkNewPwd2 : function (){
		    this.checkLogin();
			// 检查用户输入的密码是否正确
			var oldpwd = document.getElementById("oldpwd").value;
			if(oldpwd == null || oldpwd == ""){
				document.getElementById("oldpwdmsg").innerHTML="<font color='red'>请输入原始密码!</font>";
				return;
			}
			document.getElementById("oldpwdmsg").innerHTML="";
			var newpwd = document.getElementById("newpwd").value;
			var newpwd2 = document.getElementById("newpwd2").value;
			if(newpwd != null && newpwd != ""){
				if(newpwd!=newpwd2){
					document.getElementById("newpwd2msg").innerHTML="<font color='red'>两次输入的新密码应相同!</font>";
					return;
				}
				document.getElementById("newpwdmsg").innerHTML="";
			}else{
				document.getElementById("newpwdmsg").innerHTML="<font color='red'>请输入新密码!</font>";
				return;
			}
			document.getElementById("newpwd2msg").innerHTML=""
			// 修改用户密码，并提示
			var userId = document.getElementById("userId").value;
			this.checkOldPwd(userId,newpwd);
		}
	};
});