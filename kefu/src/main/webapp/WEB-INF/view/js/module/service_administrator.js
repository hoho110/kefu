define(["/easyservice/com.cnebula.yidu.dao.IAdministratorsDao?json"], function(){
	var adminService = EasyServiceClient.getRemoteProxy("/easyservice/com.cnebula.yidu.dao.IAdministratorsDao");
	return adminService;
//	return {
//		getAll : function(){
//			var rst = null;
//			try {
//				rst = adminService.getAll();
//			} catch (e) {
//				if (e.message) {
//					alert(e.message);
//				} else {
//					alert('远程服务调用失败');
//				}
//			}
//			return rst;
//		},
//		queryById : function(id){
//			var rst = null;
//			try {
//				rst = adminService.queryById(id);
//			} catch (e) {
//				if (e.message) {
//					alert(e.message);
//				} else {
//					alert('远程服务调用失败');
//				}
//			}
//			return rst;
//		},
//		createAdmin : function(admin){
//			adminService.createAdmin(admin);
//		},
//		update : function(admin){
//			adminService.update(admin);
//		},
//		checkMul : function(userName){
//			return adminService.checkMul(userName);
//		}
//	};
});