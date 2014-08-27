package com.cnebula.kefu.service.ass;

import com.easyservice.security.Permit;

public class Administrator implements Permit{
	/*
	 * 标识
	 */
	private int id;
	/*
	 * 管理员登录名
	 */
	private String userName;
	/*
	 * 管理员密码
	 */
	private String passWord;
	
	public static final int ROLE_ADMIN=0;//管理员
	public static final int ROLE_APP=1;//应用推广
	public static final int ROLE_VENDOR=2;//手机厂商
	private int role=ROLE_ADMIN;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getRole() {
		return role;
	}
	public void setRole(int role) {
		this.role = role;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassWord() {
		return passWord;
	}
	public void setPassWord(String passWord) {
		this.passWord = passWord;
	}
	@Override
	public int returnPrivilege() {
		return 1;
	}
}
