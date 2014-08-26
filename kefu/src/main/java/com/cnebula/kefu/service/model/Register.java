package com.cnebula.kefu.service.model;

public class Register {
	private int id;//ID
	private String terminalType;//终端类型（机型）
	private String imeiNum;//imei号
	private long createTime=System.currentTimeMillis();//创建时间
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
	public long getCreateTime() {
		return createTime;
	}
	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}
}
