package com.cnebula.kefu.server;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cnebula.kefu.service.IXmlConfigService;
import com.cnebula.kefu.service.db.IDataSource;
import com.cnebula.kefu.service.model.XmlConfig;
@Service
public class XmlConfigServiceImpl implements IXmlConfigService{
	@Autowired
	IDataSource dataSource;
	@Override
	public void create(XmlConfig config) throws Exception {
		dataSource.create(config);
	}

	@Override
	public void update(XmlConfig config) throws Exception {
		dataSource.update(config, config.getId());
	}

	@Override
	public XmlConfig find(int id) throws Exception {
		return dataSource.find(id, XmlConfig.class);
	}

	@Override
	public List<XmlConfig> findAll() throws Exception {
		return dataSource.findAll(XmlConfig.class);
	}

	@Override
	public void delete(int id) throws Exception {
		dataSource.delete(XmlConfig.class, id);
	}

	@Override
	public List<XmlConfig> findAllByRole(int uploadUserId) throws Exception {
		return dataSource.find("uploadUserId="+uploadUserId, XmlConfig.class);
	}

}
