define(["/easyservice/com.cnebula.kefu.service.IAppService?json"], function(){ 
	
	var service = EasyServiceClient.getRemoteProxy("/easyservice/com.cnebula.kefu.service.IAppService");
	
	return {
		create: function(appInfo) {
			return service.create(appInfo);
		},
		update: function(appInfo) {
			return service.update(appInfo);
		},
		find: function(id) {
			return service.find(id);
		},
		findAll: function() {
			return service.findAll();
		},
		deleteInfo: function(id) {
			return service["delete"](id)
		}
	};
}); 