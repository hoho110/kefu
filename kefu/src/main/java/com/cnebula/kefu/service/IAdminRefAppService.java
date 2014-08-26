package com.cnebula.kefu.service;

import java.util.List;

import com.cnebula.kefu.service.model.App;
import com.cnebula.kefu.service.model.ref.AdminRefApp;

public interface IAdminRefAppService {
	public void update(int adminId,List<AdminRefApp> refs) throws Exception;
	public List<App> findRefs(int adminId) throws Exception;
}
