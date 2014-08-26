package com.cnebula.kefu.service.model;

public class Install {
	private int id;
	private String terminalType;//终端类型（机型）
	private String imeiNum;//imei号
	private String appName;//名称
	private String appPkgName;//pkgName
	private long createTime=System.currentTimeMillis();//安装时间
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getTerminalType() {
		return terminalType;
	}
	public void setTerminalType(String terminalType) {
		this.terminalType = terminalType;
	}
	public String getImeiNum() {
		return imeiNum;
	}
	public void setImeiNum(String imeiNum) {
		this.imeiNum = imeiNum;
	}
	public String getAppName() {
		return appName;
	}
	public void setAppName(String appName) {
		this.appName = appName;
	}
	public String getAppPkgName() {
		return appPkgName;
	}
	public void setAppPkgName(String appPkgName) {
		this.appPkgName = appPkgName;
	}
	public long getCreateTime() {
		return createTime;
	}
	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}
}
