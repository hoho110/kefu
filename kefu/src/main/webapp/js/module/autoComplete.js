define(["jquery", "plugin/jquery.flexselect"], function($){
	return {
		
		/**
		 * 创建自动完成下拉列表
		 * @param originDataAreaId 存放下拉列表（select，里面为原始数据列表）的父容器
		 * @param originDataId  下拉列表（select，里面为原始数据列表）
		 * @param targetAreaId 供显示下拉列表的容器
		 * @return 自动完成元素(文本框)的id
		 * 
		 * 原理：
		 * (1) originDataAreaId和originDataId组成css选择器，确定1个存放原有数据列表的select元素
		 * 
		 * (2) 将该select元素拷贝1个，其id为originDataId+"_flexselect", 放入目标容器(targetAreaId)中。
		 * 
		 * (3) js库已经对该拷贝的select进行自动完成
		 * 
		 * 
		 * TODO:将参数改为2个，第一个参数可以去除。
		 */
		create: function(originDataAreaId, originDataId, targetAreaId){
			var dataSelect = $("#" + originDataAreaId + " select#" + originDataId);
			var cloneId = originDataId + "_" + "flexselect";
			var clonedSelecte = dataSelect.clone().attr({ 
				id: cloneId, 
	    	  	"class":"flexselect" 
	   		});
			
			$("#" + targetAreaId).append(clonedSelecte);
			$("select.flexselect").flexselect({
				allowMismatch: true,
				allowMismatchBlank: false
			});
			$("input#" + originDataId + "_flexselect_flexselect").val("");
			
			return cloneId;
		}
	};
});