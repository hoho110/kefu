define(["/easyservice/com.cnebula.kefu.service.ass.IAdministratorService?json",
        "/easyservice/com.cnebula.common.security.auth.ILoginService?json",
        "/easyservice/com.cnebula.kefu.service.IAdminRefAppService?json"], function(){ 	
	
	var adminService = EasyServiceClient.getRemoteProxy("/easyservice/com.cnebula.kefu.service.ass.IAdministratorService");
	var loginService = EasyServiceClient.getRemoteProxy("/easyservice/com.cnebula.common.security.auth.ILoginService");
	var adminRefAppService=EasyServiceClient.getRemoteProxy("/easyservice/com.cnebula.kefu.service.IAdminRefAppService");
	return {
		updatePassword: function(userId,pwd){
			return adminService.updatePassword(userId,pwd);
		},
		getCurrentAdmin: function(){
			return adminService.getCurrentAdmin();
		},
		
		// 封装loginService的对应方法
		getLoginStatus : function(){
			return loginService.getLoginStatus();
		},
		loginByNamePassword: function(n, p) {
			loginService.loginByNamePassword(n, p);
		},
		logout: function() {
			loginService.logout();
		},
		findRefs:function(adminId) {
			return adminRefAppService.findRefs(adminId);
		},
		findAll:function(role)
		{
			return adminService.findAll(role);
		},
		findByUsername:function(userName)
		{
			return adminService.findByUsername(userName);
		},
		updateRefs:function(adminId,refs)
		{
			adminRefAppService.update(adminId,refs);
		},
		create:function(adminInfo)
		{
			adminService.create(adminInfo);
		},
		find:function(id)
		{
			return adminService.find(id);
		},
		update:function(adminInfo)
		{
			adminService.update(adminInfo);
		},
		deleteInfo:function(id)
		{
			adminRefAppService.update(id,null);
			adminService.delete(id);
		}
	}; 
}); 