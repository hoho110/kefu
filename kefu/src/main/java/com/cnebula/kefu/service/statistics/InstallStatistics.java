package com.cnebula.kefu.service.statistics;

public class InstallStatistics {
	private String terminalType;//终端类型（机型）
	private String appName;//名称
	private String appPkgName;//pkgName
	private int count;
	public String getTerminalType() {
		return terminalType;
	}
	public void setTerminalType(String terminalType) {
		this.terminalType = terminalType;
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
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
}
