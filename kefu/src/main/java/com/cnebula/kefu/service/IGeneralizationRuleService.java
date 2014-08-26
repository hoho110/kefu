package com.cnebula.kefu.service;

import java.util.List;

import com.cnebula.kefu.service.model.App;
import com.cnebula.kefu.service.model.GeneralizationRule;
/**
 * 推广规则服务
 * @author THINK
 *
 */
public interface IGeneralizationRuleService {
	public void create(GeneralizationRule rule) throws Exception;
	public void update(GeneralizationRule rule) throws Exception;
	public GeneralizationRule find(int id) throws Exception;
	public List<GeneralizationRule> findAll() throws Exception;
	public void delete(int id) throws Exception;
	/**
	 * 根据客户端提供的信息返回推荐应用
	 * @param source
	 * @return
	 * @throws Exception
	 */
	//public List<App> recommend(GeneralizationRule source)throws Exception;
	public List<GeneralizationRule> recommend(GeneralizationRule source)throws Exception;
}
