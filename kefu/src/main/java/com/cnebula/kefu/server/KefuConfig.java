package com.cnebula.kefu.server;

public class KefuConfig {
	private String dataLocation;//数据存放路径
	private String newIP;//新IP
	public static KefuConfig kefuConfig;
	public String getDataLocation() {
		return dataLocation;
	}

	public void setDataLocation(String dataLocation) {
		this.dataLocation = dataLocation;
	}

	public String getNewIP() {
		return newIP;
	}

	public void setNewIP(String newIP) {
		this.newIP = newIP;
	}
}
