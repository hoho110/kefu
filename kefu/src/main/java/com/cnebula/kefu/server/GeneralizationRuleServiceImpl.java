package com.cnebula.kefu.server;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cnebula.kefu.server.tools.StringUtils;
import com.cnebula.kefu.service.IAppService;
import com.cnebula.kefu.service.IGeneralizationRuleService;
import com.cnebula.kefu.service.db.IDataSource;
import com.cnebula.kefu.service.model.GeneralizationRule;

@Service
public class GeneralizationRuleServiceImpl implements IGeneralizationRuleService{
	@Autowired
	IDataSource dataSource;
	@Autowired
	IAppService appService;
	@Override
	public void create(GeneralizationRule rule) throws Exception {
		dataSource.create(rule);
	}

	@Override
	public void update(GeneralizationRule rule) throws Exception {
		dataSource.update(rule, rule.getId());
	}

	@Override
	public GeneralizationRule find(int id) throws Exception {
		return dataSource.find(id, GeneralizationRule.class);
	}

	@Override
	public List<GeneralizationRule> findAll() throws Exception {
		return dataSource.findAll(GeneralizationRule.class	);
	}

	@Override
	public void delete(int id) throws Exception {
		dataSource.delete(GeneralizationRule.class, id);
	}

//	@Override
//	public List<App> recommend(GeneralizationRule source) throws Exception {
//		List<GeneralizationRule> rules=findAll();
//		if(rules==null||rules.size()==0)
//			return null;
//		List<String> validAppIds=new ArrayList<String>();
//		for(GeneralizationRule rule:rules)
//		{
//			if(!contain(source.getTerminalType(), rule.getTerminalType())||!contain(source.getImeiNum(), rule.getImeiNum())||!contain(source.getRegionNum(),rule.getRegionNum()))
//				continue;
//			if(StringUtils.isEmpty(rule.getApps()))
//					continue;
//			source.setOperation(rule.getOperation());
//			addNotEqual(validAppIds, rule.getApps().trim().split(","));
//		}
//		List<App> apps=new ArrayList<App>();
//		for(String validAppId:validAppIds)
//		{
//			App app=appService.find(Integer.parseInt(validAppId));
//			if(app!=null)
//				apps.add(app);
//		}
//		return apps;
//	}
	@Override
	public List<GeneralizationRule> recommend(GeneralizationRule source) throws Exception {
		List<GeneralizationRule> rules=findAll();
		List<GeneralizationRule> selectedRules=new ArrayList<GeneralizationRule>();
		if(rules==null||rules.size()==0)
			return selectedRules;
		for(GeneralizationRule rule:rules)
		{
			if(!contain(source.getTerminalType(), rule.getTerminalType())||!contain(source.getImeiNum(), rule.getImeiNum())||!contain(source.getRegionNum(),rule.getRegionNum()))
				continue;
			if(StringUtils.isEmpty(rule.getApps()))
					continue;
			selectedRules.add(rule);
		}
		return rules;
	}
	private boolean contain(String source,String config)
	{
		if(StringUtils.isEmpty(source)||StringUtils.isEmpty(config))
			return true;
		String[] configPoints=config.split(",");
		for(String configPoint:configPoints)
		{
			if(configPoint.equals(source))
				return true;
		}
		return false;
	}
	private void addNotEqual(List<String> source,String[] add)
	{
		loop:for(String addElement:add)
		{
			for(String sourceElement:source)
			{
				if(add.equals(sourceElement))
					continue loop;
			}
			source.add(addElement);
		}
	}
}
