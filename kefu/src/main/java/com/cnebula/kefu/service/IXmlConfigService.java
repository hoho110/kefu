package com.cnebula.kefu.service;

import java.util.List;

import com.cnebula.kefu.service.model.XmlConfig;

public interface IXmlConfigService {
	public void create(XmlConfig config) throws Exception;
	public void update(XmlConfig config) throws Exception;
	public XmlConfig find(int id) throws Exception;
	public List<XmlConfig> findAll() throws Exception;
	public List<XmlConfig> findAllByRole(int uploadUserId) throws Exception;
	public void delete(int id) throws Exception;
}
