package com.cnebula.kefu.service.db;

import java.sql.Connection;
import java.util.List;

public interface IDataSource {
	public void create(Object obj) throws Exception;
	
	public void update(Object obj,int id) throws Exception;
	
	public void delete(Class t,int id) throws Exception;
	
	public<T> void delete(String queryStr,Class<T> cls) throws Exception;
	
	public <T> List<T> findAll(Class<T> cls) throws Exception;
	
	public <T> T find(int id,Class<T> cls) throws Exception;
	
	public<T> List<T> find(String queryStr,Class<T> cls) throws Exception;
	
	public <T> int count(Class<T> cls) throws Exception;
	
	public <T> int count(Class<T> cls,String queryStr)throws Exception;
	
	public Connection getDataSource() throws Exception;
}
