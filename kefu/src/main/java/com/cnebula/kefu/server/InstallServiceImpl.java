package com.cnebula.kefu.server;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cnebula.kefu.server.tools.StringUtils;
import com.cnebula.kefu.service.IAdminRefAppService;
import com.cnebula.kefu.service.IInstallService;
import com.cnebula.kefu.service.ass.Administrator;
import com.cnebula.kefu.service.ass.IAdministratorService;
import com.cnebula.kefu.service.db.IDataSource;
import com.cnebula.kefu.service.model.App;
import com.cnebula.kefu.service.model.Install;
import com.cnebula.kefu.service.statistics.InstallStatistics;
@Service
public class InstallServiceImpl implements IInstallService{
	@Autowired
	IDataSource dataSource;
	private Logger log = Logger.getLogger(InstallServiceImpl.class);
	@Autowired
	IAdministratorService administratorService;
	@Autowired
	IAdminRefAppService adminRefAppService;
	@Override
	public void create(Install install) throws Exception {
		dataSource.create(install);
	}
	@Override
	public List<InstallStatistics> count(String terminalType, String appPkgName, long startTime, long endTime) throws Exception {
		List<InstallStatistics> l=new ArrayList<InstallStatistics>();
		Administrator admin=administratorService.getCurrentAdmin();
		if(admin.getId()==-1)  //匿名用户
			return l;
		Connection conn=dataSource.getDataSource();
		StringBuilder sql=new StringBuilder();
		sql.append("select count(id) num,terminalType,appName,appPkgName from "+Install.class.getSimpleName());
		StringBuilder conditions=new StringBuilder();
		if(!StringUtils.isEmpty(terminalType))
			conditions.append("terminalType='").append(terminalType).append("'");
		if(!StringUtils.isEmpty(appPkgName))
		{
			if(conditions.length()!=0)
				conditions.append(" and ");
			conditions.append("appPkgName='").append(appPkgName).append("'");
		}
		if(startTime!=-1)
		{
			if(conditions.length()!=0)
				conditions.append(" and ");
			conditions.append("createTime>=").append("?");
		}
		if(endTime!=-1)
		{
			if(conditions.length()!=0)
				conditions.append(" and ");
			conditions.append("createTime<=").append("?");
		}
		if(admin.getRole()==Administrator.ROLE_APP)
		{
			List<App> apps=adminRefAppService.findRefs(admin.getId());
			if(apps==null||apps.size()==0)
				return l;
			if(conditions.length()!=0)
				conditions.append(" and ");
			conditions.append("(");
			for(int i=0;i<apps.size();i++)
			{
				App app=apps.get(i);
				if(i>0)
					conditions.append(" or ");
				conditions.append("appPkgName='").append(app.getPkgName()).append("'");
			}
			conditions.append(")");
		}
		if(conditions.length()!=0)
			sql.append(" where ").append(conditions);
		sql.append(" group by terminalType,appName,appPkgName");
		PreparedStatement stmt=null;
		ResultSet rs=null;
		try
		{
			stmt = conn.prepareStatement(sql.toString());
			if(startTime!=-1)
				stmt.setDate(1, new java.sql.Date(startTime));
			if(endTime!=-1)
			{
				if(startTime!=-1)
					stmt.setDate(2, new java.sql.Date(endTime));
				else
					stmt.setDate(1, new java.sql.Date(endTime));
			}
			rs = stmt.executeQuery();
			while (rs.next()) {
				InstallStatistics statistics=new InstallStatistics();
				statistics.setAppName(rs.getString("appName"));
				statistics.setAppPkgName(rs.getString("appPkgName"));
				statistics.setTerminalType(rs.getString("terminalType"));
				statistics.setCount(rs.getInt("num"));
				l.add(statistics);
			}
		}catch(Exception e)
		{
			log.error(e.getMessage(),e);
		}finally
		{
			try {
				if(rs!=null)
					rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			try {
				if(stmt!=null)
				stmt.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return l;
	}
}
