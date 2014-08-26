package com.cnebula.kefu.service.model;
/**
 * 推广规则
 * @author THINK
 *
 */
public class GeneralizationRule {
	private int id;//ID
	private String terminalType;//终端类型（机型），多个以逗号分隔
	private String imeiNum;//imei号，多个以逗号分隔
	private String regionNum;//地区代码，多个以逗号分隔
	public static final String OPERATION_AUTOINSTALL="autoinstall";
	public static final String OPERATION_PROMPT="prompt";
	public static final String OPERATION_NOTIFYDOWNLOAD="notifydownload";
	private String operation;//客户端行为方式标识,operatoin=prompt;autoinstall;notifydownload
	private String apps;//推荐的app的ID，多个以逗号分隔
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
	public String getRegionNum() {
		return regionNum;
	}
	public void setRegionNum(String regionNum) {
		this.regionNum = regionNum;
	}
	public String getOperation() {
		return operation;
	}
	public void setOperation(String operation) {
		this.operation = operation;
	}
	public String getApps() {
		return apps;
	}
	public void setApps(String apps) {
		this.apps = apps;
	}
}
