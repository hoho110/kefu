package com.cnebula.kefu.service.model;

public class XmlConfig {
	private int id;//ID
	private String name;//名称
	private String path;//路径
	private int uploadUserId;//上传用户ID
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
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public int getUploadUserId() {
		return uploadUserId;
	}
	public void setUploadUserId(int uploadUserId) {
		this.uploadUserId = uploadUserId;
	}
}
