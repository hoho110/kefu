package com.easyservice.test;

import com.easyservice.security.Permit;

public class User implements Permit{
	private int role;
	private String name;
	public User(){}
	public User(String name,int role)
	{
		this.name=name;
		this.role=role;
	}
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	@Override
	public int getPrivilege() {
		// TODO Auto-generated method stub
		return 0;
	}
	@Override
	public void setPrivilege(int privilege) {
		// TODO Auto-generated method stub
		
	}
}
