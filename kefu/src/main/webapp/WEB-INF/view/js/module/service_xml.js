define(["/easyservice/com.cnebula.kefu.service.IXmlConfigService?json"], function(){ 
	
	var service = EasyServiceClient.getRemoteProxy("/easyservice/com.cnebula.kefu.service.IXmlConfigService");
	
	return {
		create: function(info) {
			return service.create(info);
		},
		update: function(info) {
			return service.update(info);
		},
		find: function(id) {
			return service.find(id);
		},
		findAll: function() {
			return service.findAll();
		},
		deleteInfo: function(id) {
			return service["delete"](id)
		},
		findAllByRole: function(uploadUserId) {
			return service.findAllByRole(uploadUserId);
		}
	};
}); 