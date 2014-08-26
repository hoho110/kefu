package com.cnebula.kefu.service;

import java.util.List;

import com.cnebula.kefu.service.model.App;

public interface IAppService {
	public void create(App app) throws Exception;
	public void update(App app) throws Exception;
	public App find(int id) throws Exception;
	public List<App> findAll() throws Exception;
	public void delete(int id) throws Exception;
}
