package com.easyservice.security;

import java.util.ArrayList;
import java.util.List;

import com.easyservice.xml.annotation.CollectionStyleType;
import com.easyservice.xml.annotation.XMLMapping;

public class Role{
	private int privilege;
	private List<PermissionRule> permissionRules=new ArrayList<PermissionRule>();
	@XMLMapping(collectionStyle=CollectionStyleType.FLAT,childTag="PermissionRule")
	public List<PermissionRule> getPermissionRules() {
		return permissionRules;
	}
	public void setPermissionRules(List<PermissionRule> permissionRules) {
		this.permissionRules = permissionRules;
	}
	public int getPrivilege() {
		return privilege;
	}
	public void setPrivilege(int privilege) {
		this.privilege = privilege;
	}
}

