package com.cnebula.kefu.server;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cnebula.kefu.service.IAdminRefAppService;
import com.cnebula.kefu.service.IAppService;
import com.cnebula.kefu.service.db.IDataSource;
import com.cnebula.kefu.service.model.App;
import com.cnebula.kefu.service.model.ref.AdminRefApp;
@Service
public class AdminRefAppServiceImpl implements IAdminRefAppService{
	@Autowired
	IDataSource dataSource;
	@Autowired
	IAppService appService;
	private static Logger log = Logger.getLogger(AdminRefAppServiceImpl.class);
	@Override
	public void update(int adminId, List<AdminRefApp> refs) throws Exception {
		StringBuilder queryStr =new StringBuilder();
		queryStr.append("adminId=").append(adminId);
		dataSource.delete(queryStr.toString(), AdminRefApp.class);
		if(refs==null||refs.size()==0)
			return;
		for(AdminRefApp ref:refs)
			dataSource.create(ref);
	}

	@Override
	public List<App> findRefs(int adminId) throws Exception {
		List<App> apps=new ArrayList<App>();
		List<AdminRefApp> refs=dataSource.find("adminId="+adminId, AdminRefApp.class);
		if(refs==null||refs.size()==0)
			return apps;
		for(AdminRefApp ref:refs)
		{
			App app=appService.find(ref.getAppId());
			if(app!=null)
				apps.add(app);
		}
		return apps;
	}

}
