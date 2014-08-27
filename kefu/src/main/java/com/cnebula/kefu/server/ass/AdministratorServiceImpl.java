package com.cnebula.kefu.server.ass;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.cnebula.kefu.server.tools.StringUtils;
import com.cnebula.kefu.service.ass.Administrator;
import com.cnebula.kefu.service.ass.IAdministratorService;
import com.cnebula.kefu.service.ass.SessionTimeOutException;
import com.cnebula.kefu.service.db.IDataSource;

/**
 * 用户管理服务接口实现
 * 
 * @author lik
 * @date 2012-09-03
 * 
 * 
 */
@Service
public class AdministratorServiceImpl implements IAdministratorService {
	public static final String SESSION_OUT="会话过期或访问权限受阻";
	private Logger log=Logger.getLogger(this.getClass());
	@Autowired
	IDataSource dataSource;
	@Override
	public Administrator getAdmin(String name, String password) throws Exception {
		if(StringUtils.isEmpty(name)||StringUtils.isEmpty(password))
			return null;
		StringBuilder queryStr=new StringBuilder();
		queryStr.append("userName='").append(name).append("' and passWord='").append(password).append("'");
		List<Administrator> admins=dataSource.find(queryStr.toString(), Administrator.class);
		if(admins!=null&&admins.size()>0)
			return admins.get(0);
		return null;
	}


	@Override
	public Administrator getCurrentAdmin() throws SessionTimeOutException{
		HttpSession session=getCurrentSession();
		if(session==null)
			return null;
		return (Administrator)session.getAttribute(SESSION_ATTRIBUTENAME_USER);
	}


	@Override
	public String updatePassword(int userId, String password) throws Exception {
		Administrator admin=find(userId);
		if(admin==null)
			return "未找到该用户";
		admin.setPassWord(password);
		dataSource.update(admin, userId);
		return "修改密码成功,新密码为"+password;
	}


	@Override
	public Administrator find(int id) throws Exception {
		return dataSource.find(id, Administrator.class);
	}


	@Override
	public List<Administrator> findAll(int role) throws Exception {
		return dataSource.find("role="+role, Administrator.class);
	}


	@Override
	public Administrator findByUsername(String userName) throws Exception {
		List<Administrator> admins=dataSource.find("userName='"+userName+"'", Administrator.class);
		if(admins!=null&&admins.size()>0)
			return admins.get(0);
		return null;
	}


	@Override
	public void create(Administrator admin) throws Exception {
		if(StringUtils.isEmpty(admin.getUserName())||StringUtils.isEmpty(admin.getPassWord()))
			throw new Exception("用户名密码不能为空");
		if(findByUsername(admin.getUserName())!=null)
			throw new Exception("用户名重复");
		dataSource.create(admin);
	}


	@Override
	public void update(Administrator admin) throws Exception {
		Administrator ad=find(admin.getId());
		if(ad==null)
			return;
		if(StringUtils.isEmpty(admin.getPassWord()))
			throw new Exception("密码不能为空");
		ad.setPassWord(admin.getPassWord());
		dataSource.update(ad, ad.getId());
	}


	@Override
	public void delete(int id) throws Exception {
		dataSource.delete(Administrator.class, id);
	}
	private HttpSession getCurrentSession()
	{
		 HttpSession session=((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest().getSession();
		 return session;
	}


	@Override
	public void logout() {
		HttpSession session=getCurrentSession();
		if(session==null)
			return;
		session.removeAttribute(SESSION_ATTRIBUTENAME_USER);
	}


	@Override
	public void loginByNamePassword(String username, String password)
			throws Exception {
		Administrator admin=getAdmin(username, password);
		if(admin==null)
			throw new Exception("用户名或密码错误");
		HttpSession session=getCurrentSession();
		session.setAttribute(SESSION_ATTRIBUTENAME_USER, admin);
	}


	@Override
	public boolean isLogin() throws SessionTimeOutException {
		return getCurrentAdmin()==null?false:true;
	}
}
