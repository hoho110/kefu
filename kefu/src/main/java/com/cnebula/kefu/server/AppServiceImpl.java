package com.cnebula.kefu.server;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cnebula.kefu.service.IAppService;
import com.cnebula.kefu.service.db.IDataSource;
import com.cnebula.kefu.service.model.App;
@Service
public class AppServiceImpl implements IAppService{
	@Autowired
	IDataSource dataSource;
	@Override
	public void create(App app) throws Exception {
		dataSource.create(app);
	}

	@Override
	public void update(App app) throws Exception {
		dataSource.update(app, app.getId());
	}

	@Override
	public App find(int id) throws Exception {
		return dataSource.find(id, App.class);
	}

	@Override
	public List<App> findAll() throws Exception {
		return dataSource.findAll(App.class);
	}

	@Override
	public void delete(int id) throws Exception {
		dataSource.delete(App.class, id);
	}

}
