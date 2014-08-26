define(["/easyservice/com.cnebula.kefu.service.IGeneralizationRuleService?json"], function(){ 
	
	var service = EasyServiceClient.getRemoteProxy("/easyservice/com.cnebula.kefu.service.IGeneralizationRuleService");
	
	return {
		create: function(ruleInfo) {
			return service.create(ruleInfo);
		},
		update: function(ruleInfo) {
			return service.update(ruleInfo);
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