define(["/easyservice/com.cnebula.kefu.service.IDistrictService?json"], function(){ 
	var service = EasyServiceClient.getRemoteProxy("/easyservice/com.cnebula.kefu.service.IDistrictService");
	return {
		findAll: function() {
			return service.findAll();
		}
	};
}); 