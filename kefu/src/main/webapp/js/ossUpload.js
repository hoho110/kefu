/**
 * 
 * @author zhengyy
 * @version 1.0.0
 * @namespace oss
 * @classDescription oss系统上传控件的封装
 * 依赖：jQuery库、jquery上传控件Uploadify v2.1.4
 *
 * 对外提供3个方法：
 * oss.initUploadify(element, fileType, callback)
 * oss.changeFileType(fileType)
 * oss.setOssServer(server, port))
 * @see: /com.cnebula.yidu.server/WebContent/pages/eduCenter/tplt/datafile/edit.html中的调用
 * 
 */
var oss = {
	ossId: null,
	uploadElement: null,
	callback: null,
	oss_uploading: false,		// 是否正在上传
	ossServer: "namenode.oss.calis.edu.cn",
	ossPort: "9001",
	ossUrl: "http://namenode.oss.calis.edu.cn:9001/easyservice/com.cnebula.oss.service.client.IClientSupportService",
	fileMap: {
		marc: {
			stuff: "*.iso;*.zip",
			stuffDesc: "支持格式:ISO,zip"
		},	
		excel: {
			stuff: "*.xls;*.xlsx;*.zip",
			stuffDesc: "支持格式:excel,zip"
		},
		xml: {
			stuff: "*.xml;*.zip",
			stuffDesc: "支持格式:xml,zip"
		},
		defaultFormat: {
			stuff: "*.xls;*.xlsx;*.iso;*.xml;*.zip",
			stuffDesc: "支持格式:excel,ISO,xml,zip"
		}
	},
	
	/**
	 * 选择文件后调用oss的上传功能
	 */
	uploadFile: function(){
		var signArray;
		try {
			var signService = EasyServiceClient.getRemoteProxy("/easyservice/com.cnebula.yidu.service.admin.ISignService"); //TODO:依赖
			signArray = signService.getSign("");
		} catch(e) {
			alert("上传出错!");
			//popup.closeWindow();
			throw new Error("located in oss.upload method! error message:" + e.message || e);
		}
	   	var appId = signArray[0];
	   	var _fileId =  signArray[1];
	   	this.ossId = signArray[1];
	   	var returnURL=signArray[2];
	   	var signDateTime=signArray[3];
	   	var expiredTime=signArray[4];    	
	   	var dataTypeCode=signArray[5];
	   	var dataTypeVersion=signArray[6];
	   	var sign = signArray[7];
	  		
		var clientSupportService = EasyServiceClient.getRemoteProxy(this.ossUrl);
	   	clientSupportService.getUploadTargetDataNode(appId, _fileId, returnURL, 
	   		signDateTime, expiredTime, dataTypeCode, 
	   		dataTypeVersion, sign, function(rt, success, method, id){
		   		if (rt.stateCode!="200") {
		   	    	//popup.closeWindow();
			    	alert(rt.message);
		    	} else {// 上传成功返回URL
		    		// 设置 scriptData 的参数
		            oss.uploadElement.uploadifySettings('script', rt.fullURL);   
		            // 上传
		            oss.uploadElement.uploadifyUpload();
		    	}
	   	});
	},
	
	/**
	 * 初始化上传文件控件
	 * @param element，需要绑定的页面元素，点击后即进行上传操作
	 * @param fileType，文件类型：当前支持"xml"、"iso"、"excel"3种字符串，代表不同的文件
	 * @param callback，回调函数
	 */
	initUploadify: function(element, fileType, callback) {
		this.uploadElement = element;
		this.callback = callback;
		var stuff = this.fileMap[fileType] ? this.fileMap[fileType].stuff : this.fileMap["defaultFormat"].stuff;
		var stuffDesc = this.fileMap[fileType] ? this.fileMap[fileType].stuffDesc : this.fileMap["defaultFormat"].stuffDesc;
		this.cfg.fileExt = stuff;
		this.cfg.fileDesc = stuffDesc;
		this.uploadElement.uploadify(this.cfg);
	},
	
	cfg: {   
		'buttonImg': '/educhina/pages/eduCenter/img/addfile.gif',
		'uploader'       : '/educhina/pages/eduCenter/js/plugin/uploadify/uploadify.swf',
		'method'         :'POST',  // 如果要传参数，就必须改为GET
		'cancelImg'      : '/educhina/pages/eduCenter/js/plugin/uploadify/cancel.png',
		'folder'         : 'UploadFile', // 要上传到的服务器路径，
		'queueID'        : 'fileQueue',   
		'auto'           : false, // 选定文件后是否自动上传，默认false
		'multi'          : false, // 是否允许同时上传多文件，默认false
		'simUploadLimit' : 1, // 一次同步上传的文件数目
		'sizeLimit'      : 4294967296, // 设置单个文件大小限制，单位为byte
		'queueSizeLimit' : 5, // 限制在一次队列中的次数（可选定几个文件）。默认值= 999，而一次可传几个文件由simUploadLimit属性决定。
		'fileDesc'       : "", // 如果配置了以下的'fileExt'属性，那么这个属性是必须的
		'fileExt'        : "",
		
		onSelect: function(event, queueID, fileObj) {
			document.getElementById("uploadifyUploader").width="1px;"
			if (oss.oss_uploading){
				alert("正在上传中，请等待完毕或取消后重新上传");
				return;
			}
			document.getElementById("fileName").innerHTML=fileObj.name;
			oss.oss_uploading = true;
//			popup.openWindow({
//				url:'about:blank', 
//				width: 1,  
//				height:1, 
//				title:''
//			});
			oss.uploadFile();
		},
		
		onComplete: function (event, queueID, fileObj, response, data) {  
			//popup.closeWindow();
			if (response=="200") {
				oss.callback(fileObj, oss.ossId);
			} else {
				oss.oss_uploading = false;
				alert("上传失败,请尝试重新上传。响应代码:" + response);
			}
		},
		
		onCancel: function(event, queueID, fileObj) { 
			document.getElementById("uploadifyUploader").width="120px;"
			document.getElementById("fileName").innerHTML="";
			oss.uploadElement.uploadifyClearQueue();
			oss.oss_uploading = false;
			alert("取消了" + fileObj.name+"文件的上传。");
		},
		
		onError: function(event, queueID, fileObj){  
			document.getElementById("uploadifyUploader").width="120px;"
			oss.oss_uploading = false;
			alert("文件:" + fileObj.name + "上传失败");
		}
    },
	
	/**
	 * 根据切换的文件类型，设置不同的格式提示
	 */
    changeFileType: function(fileType) {
		var stuff = this.fileMap[fileType] ? this.fileMap[fileType].stuff : this.fileMap["defaultFormat"].stuff;
		var stuffDesc = this.fileMap[fileType] ? this.fileMap[fileType].stuffDesc : this.fileMap["defaultFormat"].stuffDesc;
		this.uploadElement.uploadifySettings("fileExt",stuff);
		this.uploadElement.uploadifySettings("fileDesc",stuffDesc);
	},
	
	/**
	 * 设置OSS服务器域名和端口
	 * @param server, oss系统的域名,不以http开头。例如:"www.oss.calis.cn"
	 * @param port, oss系统的服务端口
	 */
	setOssServer: function(server, port) {
		this.ossServer = server;
		this.ossPort = port;
		this.ossUrl = "http://" + this.ossServer + ":" + this.ossPort + "/easyservice/com.cnebula.oss.service.client.IClientSupportService";
	},
	
	/**
	 * 根据url设置oss地址
	 * @param url, oss的url地址，形如"namenode.oss.calis.edu.cn:9001"
	 */
	setOssUrl: function(url) {
		var serviceUrl = "http://" + url + "/easyservice/com.cnebula.oss.service.client.IClientSupportService";
		this.ossUrl = serviceUrl;
		require([serviceUrl + "?json"]);
	}
};