package com.cnebula.kefu.service.ass;

import java.util.List;

/**
 * 管理员管理服务接口
 */
public interface IAdministratorService {
	public static final String SESSION_ATTRIBUTENAME_USER="user";
	/**
	 * 根据管理员用户名与密码查询管理员信息
	 * 
	 * @param username
	 *            用户名
	 * @param pwd
	 *            密码
	 * @return 管理员信息
	 * @throws Exception 
	 */
	public Administrator getAdmin(String userName, String pwd) throws Exception;
	/**
	 * 获取当前登录管理员信息
	 * 
	 * @return 当前登录管理员的信息
	 * @throws Exception
	 *             查询当前管理员信息出错时
	 */
	public Administrator getCurrentAdmin() throws SessionTimeOutException;
	/**
	 * 修改管理员密码
	 * 
	 * @param userId
	 *            管理员ID
	 * @param password
	 *            新密码
	 * @return 修改出错
	 */
	public String updatePassword(int userId, String password)
			throws Exception;
	
	public Administrator find(int id) throws Exception;
	
	public List<Administrator> findAll(int role) throws Exception;
	
	public Administrator findByUsername(String userName) throws Exception;
	
	public void create(Administrator admin) throws Exception;
	
	public void update(Administrator admin)throws Exception;
	
	public void delete(int id)throws Exception;
	public void logout();
	public void loginByNamePassword(String username,String password)throws Exception;
	public boolean isLogin() throws SessionTimeOutException;
//
//	/**
//	 * 根据管理员ID，获得管理员的密码
//	 * 
//	 * @param userId
//	 *            管理员ID
//	 * @return 管理员密码
//	 * @throws Exception
//	 *             查询出错时
//	 */
//	public String getPassWord(String userId) throws Exception;

}
