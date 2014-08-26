package com.cnebula.kefu.service.model;

public class App {
	private int id;//ID
	private String name;//名称
	private String pkgName;//pkgName
	private String installName;//安装包名
	private String path;//路径
	private String message;//信息
	public String operation;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getInstallName() {
		return installName;
	}
	public void setInstallName(String installName) {
		this.installName = installName;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getPkgName() {
		return pkgName;
	}
	public void setPkgName(String pkgName) {
		this.pkgName = pkgName;
	}
}
