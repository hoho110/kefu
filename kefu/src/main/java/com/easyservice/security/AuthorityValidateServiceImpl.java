package com.easyservice.security;

import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.log4j.Logger;
import org.springframework.core.io.Resource;

import com.easyservice.exception.PermissionException;
import com.easyservice.xml.EasyObjectXMLTransformerImpl;
import com.easyservice.xml.IEasyObjectXMLTransformer;
public class AuthorityValidateServiceImpl implements IAuthorityValidateService{
	private IEasyObjectXMLTransformer xmlTransformer=new EasyObjectXMLTransformerImpl();
	private Resource configLocation;//权限配置文件路径
	private Logger logger=Logger.getLogger(AuthorityValidateServiceImpl.class);
	private StaticRolesConfig config;
	@Override
	public boolean checkPermission(Object user,boolean fetchServiceSdl, String applyService,
			String applyMethod) throws PermissionException {
		if(config==null||!config.enabled)
			return true;
		int privilege=-1;
		if(user!=null)
		{
			if(!(user instanceof Permit))
				throw new PermissionException("user entity must implements Permit");
			privilege=((Permit)user).getPrivilege();
		}
		if(fetchServiceSdl)
			logger.debug("用户角色：{privilege:"+privilege+"},申请获取服务:"+applyService+"定义");
		else
			logger.debug("用户角色：{privilege:"+privilege+"},申请执行服务:"+applyService+"方法:"+applyMethod);
		Role role=getRoleByPrivilege(privilege);
		if(role==null){
			logger.debug("未找到该用户角色配置");
			return false;
		}
		return checkPermissionRules(role, applyService, applyMethod, fetchServiceSdl);
	}
	private Role getRoleByPrivilege(int privilege)
	{
		List<Role> roles=config.getRoles();
		if(roles==null||roles.size()==0)
			return null;
		for (Role role : config.roles) {
			if (role.getPrivilege()==privilege) {
				return role;
			}
		}
		return null;
	}
	private boolean checkPermissionRules(Role role,String applyService,String applyMethod,boolean fetchServiceSdl)
	{
		if(role==null)
			return false;
		for (PermissionRule rule : role.getPermissionRules()) {
			if (rule.getEntityLimitType().equals(applyService))
			{
				if(fetchServiceSdl)
					return true;
				if(rule.getOperations()==null||rule.getOperations().trim().length()==0)
					return true;
				String[] ops=rule.getOperations().split(";");
				for(String op:ops)
				{
					if(op.equals(applyMethod))
						return true;
				}
				return false;
			}
		}
		return false;
	}
	public Resource getConfigLocation() {
		return configLocation;
	}
	public void setConfigLocation(Resource configLocation) {
		this.configLocation = configLocation;
	}
	@PostConstruct
	public void init() {
		//加载权限配置文件到内存中
		try {
			config=xmlTransformer.parse(configLocation.getInputStream(), StaticRolesConfig.class);
		} catch (Throwable e)
		{
			logger.error(e.getMessage(),e);
		}
		logger.info("权限配置文件装载完毕,可提供默认权限服务");
	}
}
